import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllNonActiveGames } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
const PreviousGames = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetAllNonActiveGames().then((res) => {
      if (res.status === 200) {
        setGames(res.data.map((game) => ({
          id: game._id,
          name: game?.gameName,
          gameImage: game?.gameImage,
          availableSeats: game.seats.filter(seat => seat.isOccupied === false).length,
          totalSeats: game.totalSeats,
          status: game.status
        })));
      } else {
        toast.error('Error fetching games');
      }
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Previous Games</h1>
          <button
            onClick={() => navigate('/games')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                {game.gameImage ? (
                  <div className="w-full h-48 relative overflow-hidden">
                    <img
                      src={game.gameImage}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h2>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Booked Seats</span>
                      <span>{game.totalSeats - game.availableSeats} / {game.totalSeats}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${((game.totalSeats - game.availableSeats) / game.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {game.status === 'ended' && (
                    <button
                      onClick={() => navigate(`/leaderboard/${game.id}`)}
                      className="w-full px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    >
                      View Leaderboard
                    </button>
                  )}
                </div>
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
  );
};

export default PreviousGames;