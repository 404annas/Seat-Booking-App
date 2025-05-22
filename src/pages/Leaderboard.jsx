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

  const handleBackClick = () => {
    isAdmin ? navigate('/admin/dashboard') : navigate('/games');
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      GetLeaderboardAPI(gameId),
      GetAllNonActiveGames()
    ]).then(([leaderboardRes, prevGamesRes]) => {
      if (leaderboardRes.status === 200) {
        const { gameDetails, leaderboard, winners } = leaderboardRes.data;
        setGameData({
          gameDetails: {
            ...gameDetails,
            id: gameDetails.id,
            gameName: gameDetails.gameName,
            gameImage: gameDetails.gameImage,
            description: gameDetails.description,
            additionalInfo: gameDetails.additionalInfo,
            universalGift: gameDetails.universalGift,
            universalGiftImage: gameDetails.universalGiftImage,
            totalSeats: gameDetails.totalSeats,
            freeSeats: gameDetails.freeSeats,
            paidSeats: gameDetails.paidSeats,
            freeSeatsAwarded: gameDetails.freeSeatsAwarded || 0
          },
          leaderboard,
          winners: winners || []
        });
      }
      if (prevGamesRes.status === 200) {
        setPreviousGames(prevGamesRes.data.map(game => ({
          id: game._id,
          name: game.gameName,
          gameImage: game.gameImage,
          availableSeats: game.seats.filter(seat => !seat.isOccupied).length,
          totalSeats: game.totalSeats,
          status: game.status
        })));
      }
    }).catch((error) => {
      console.error('Error:', error);
      toast.error('Error loading data');
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

        <div className="space-y-8">
          {/* Game Card with Winners */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="relative h-full min-h-[300px] group">
                  {gameData.gameDetails.gameImage ? (
                    <img
                      src={gameData.gameDetails.gameImage}
                      alt={gameData.gameDetails.gameName || 'Game visual'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
              <div className="p-8 md:w-2/3">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">{gameData.gameDetails.gameName}</h2>

                  {/* Winners Section */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Winners</h3>
                    <div className="space-y-4">
                      {gameData.winners && gameData.winners.length > 0 ? (
                        gameData.winners.map((winner, index) => (
                          <div
                            key={winner.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                  index === 1 ? 'bg-gray-100 text-gray-600' :
                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                      'bg-blue-100 text-blue-600'
                                }`}>
                                <span className="font-bold">{index + 1}</span>
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-lg font-medium text-gray-900">{winner.userName}</h4>
                                <p className="text-sm text-gray-500">Seat: {winner.seatNumber}</p>
                                <p className="text-sm text-gray-500">Declared Winner: {new Date(winner.declaredWinnerAt).toLocaleString()}</p>
                              </div>
                              {winner.prize && (
                                <div className="flex-shrink-0">
                                  <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                                    Prize: {winner.prize}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No winners declared yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Description and Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>              <div className="space-y-4">
                <div
                  className="text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: gameData.gameDetails.description || 'No description available'
                  }}
                />
                <h3 className="text-lg font-medium text-gray-700">Additional Information</h3>
                <div
                  className="text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: gameData.gameDetails.additionalInfo || 'No additional information'
                  }}
                />
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
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Previous Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousGames.length > 0 ? previousGames.map((game) => (
                <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  {game.gameImage ? (
                    <div className="w-full h-40 relative overflow-hidden">
                      <img
                        src={game.gameImage}
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Booked Seats</span>
                        <span>{game.totalSeats - game.availableSeats} / {game.totalSeats}</span>
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
                </div>
              )) : (
                <div className="col-span-3 text-center text-gray-600">
                  No previous games available
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;