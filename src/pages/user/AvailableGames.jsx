import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllActiveGames, MakeRequestAPI } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const AvailableGames = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetAllActiveGames()
      .then((res) => {
        if (res.status === 200) {
          setGames(
            res.data.map((game) => ({
              id: game._id,
              name: game?.gameName,
              availableSeats: game.seats.filter((seat) => seat.isOccupied === false).length,
              totalSeats: game.totalSeats,
              requestStatus:
                game.Pending_Requests.find((user) => user.userId === localStorage.getItem('userId'))?.status ===
                'rejected'
                  ? 'rejected'
                  : game.Approved_Users.find((user) => user._id === localStorage.getItem('userId'))
                  ? 'approved'
                  : null,
              status: game.status,
            }))
          );
        } else {
         toast.error(res.data.message || 'Error fetching games');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleJoin = (gameId) => {
    MakeRequestAPI(gameId)
      .then((res) => {
        if (res && res.status === 201) {
       toast.success(res.data.message || 'Request sent successfully!');
        } else {
        toast.error(res.data.message || 'Error making request');
        }
      })
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Available Games</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                My Profile
              </button>
              <button
                onClick={() => navigate('/previous/games')}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Previous Games
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                onClick={() => {
                  localStorage.removeItem('userId');
                  localStorage.removeItem('token');
                  navigate('/');
                  toast.success('Logged out successfully!');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h2>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Available Seats</span>
                    <span>
                      {game.availableSeats} / {game.totalSeats}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(game.availableSeats / game.totalSeats) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {game.status === 'ended' ? (
                  <button
                    onClick={() => navigate(`/leaderboard/${game.id}`)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  >
                    Game Ended! View Leaderboard
                  </button>
                ) : game.requestStatus === 'approved' ? (
                  <div className="text-center py-2" onClick={() => navigate(`/select-seat/${game.id}`)}>
                    <button className="text-green-600 font-semibold cursor-pointer hover:text-yellow-700 transition duration-200 rounded-lg bg-green-100 p-2">
                      Request Approved! join the game.
                    </button>
                  </div>
                ) : game.requestStatus === 'rejected' ? (
                  <div className="text-center py-2">
                    <button className="text-red-600 font-semibold cursor-pointer hover:text-yellow-700 transition duration-200 rounded-lg bg-green-100 p-2">
                      Request Rejected!.
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoin(game.id)}
                    disabled={game.availableSeats === 0}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      game.availableSeats === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                  >
                    {game.availableSeats === 0 ? 'No Seats Available' : 'Request to Join'}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">No games available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableGames;