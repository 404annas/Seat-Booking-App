import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetLeaderboardAPI, GetAllNonActiveGames } from '../API_handler';
import Loader from '../components/Loader/Loader';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loading, setLoading] = useState(true);
  const [previousGames, setPreviousGames] = useState([]);
  const [gameData, setGameData] = useState({
    gameDetails: {},
    leaderboard: []
  });
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      GetLeaderboardAPI(gameId),
      GetAllNonActiveGames()
    ]).then(([leaderboardRes, prevGamesRes]) => {
      if (leaderboardRes.status === 200) {
        const { gameDetails, leaderboard } = leaderboardRes.data;
        setGameData({
          gameDetails: {
            ...gameDetails,
            id: gameDetails.id,
            gameName: gameDetails.gameName,
            description: gameDetails.description,
            additionalInfo: gameDetails.additionalInfo,
            universalGift: gameDetails.universalGift,
            universalGiftImage: gameDetails.universalGiftImage,
            totalSeats: gameDetails.totalSeats,
            freeSeats: gameDetails.freeSeats,
            paidSeats: gameDetails.paidSeats,
            freeSeatsAwarded: gameDetails.freeSeatsAwarded || 0
          },
          leaderboard
        });
      }
      if (prevGamesRes.status === 200) {
        setPreviousGames(prevGamesRes.data.map(game => ({
          id: game._id,
          name: game.gameName,
          availableSeats: game.seats.filter(seat => !seat.isOccupied).length,
          totalSeats: game.totalSeats,
          status: game.status
        })));
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Game Leaderboard</h1>
          <button
            onClick={() => isAdmin ? navigate('/admin/dashboard') : navigate('/games')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back
          </button>
        </div>

        {/* Game Card with Winners */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                className="h-48 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2070&auto=format&fit=crop"
                alt="Game visual"
              />
            </div>
            <div className="p-8 md:w-2/3">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Game Details
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {gameData.gameDetails.gameName}
              </h2>

              {/* Winners List */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Winners</h3>
                <div className="grid gap-4">
                  {gameData.leaderboard.map((winner) => (
                    <div
                      key={winner.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          Seat #{winner.seatNumber}
                        </div>
                        <span className="font-medium text-gray-900">{winner.userName}</span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Description and Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
            <div className="space-y-4">
              <p className="text-gray-600">{gameData.gameDetails.description || 'No description available'}</p>
              <h3 className="text-lg font-medium text-gray-700">Additional Information</h3>
              <p className="text-gray-600">{gameData.gameDetails.additionalInfo || 'No additional information'}</p>
            </div>
          </div>

          {/* Universal Gift */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gift</h2>
            <div className="space-y-4">
              <p className="text-gray-600">{gameData.gameDetails.universalGift || 'No universal gift'}</p>              {gameData.gameDetails.universalGiftImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={gameData.gameDetails.universalGiftImage}
                    alt="Universal gift"
                    className="rounded-lg max-w-full h-auto shadow-md hover:shadow-xl transition-shadow duration-300"
                    style={{ maxHeight: '80vh' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Previous Games Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Previous Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousGames.length > 0 ? (
              previousGames.map((game) => (
                <div key={game.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Booked Seats</span>
                      <span>
                        {game.totalSeats - game.availableSeats} / {game.totalSeats}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${((game.totalSeats - game.availableSeats) / game.totalSeats) * 100}%` }}
                      />
                    </div>
                  </div>
                  {game.id !== gameId && (
                    <button
                      onClick={() => navigate(`/leaderboard/${game.id}`)}
                      className="w-full px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    >
                      View Leaderboard
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-600">
                No previous games available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;