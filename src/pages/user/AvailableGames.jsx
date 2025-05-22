import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllActiveGames, MakeRequestAPI } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from 'react-icons/cg';
import { FaHistory } from 'react-icons/fa';

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
              gameImage: game?.gameImage,
              availableSeats: game.seats.filter((seat) => seat.isOccupied === false).length,
              totalSeats: game.totalSeats,
              requestStatus:
                game.Pending_Requests.find((user) => user.userId === localStorage.getItem('userId'))?.status ===
                  'rejected'
                  ? 'rejected'
                  : game.Pending_Requests.find((user) => user.userId === localStorage.getItem('userId'))?.status ===
                    'pending' ? 'pending' : game.Approved_Users.find((user) => user._id === localStorage.getItem('userId'))
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

  console.log(games)

  const handleJoin = (gameId) => {
    MakeRequestAPI(gameId)
      .then((res) => {
        if (res && res.status === 201) {
          toast.success(res.data.message || 'Request sent successfully!');
          location.reload();
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

              </button>
              <button
                onClick={() => navigate('/previous/games')}
                className="bg-gray-800 flex justify-center items-center text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <FaHistory className=' h-5 w-5  ' />
                Previous Games
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('userId');
                  localStorage.removeItem('token');
                  localStorage.removeItem('isAdmin');
                  navigate('/admin');
                  toast.success('Logged out successfully');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group relative"
              >
                {/* icon and tooltip */}
                <IoLogOutOutline className=' h-7 w-7 ' />
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  Logout
                </span>
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group relative"
                onClick={() => {
                  navigate('/profile')
                }}
              >
                <CgProfile className=' h-7 w-7   ' />
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  My Profile
                </span>

              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? (games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden ">
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
                      Join The Game .
                    </button>
                  </div>
                ) : game.requestStatus === 'rejected' ? (
                  <div className="text-center py-2">
                    <button className="text-red-600 font-semibold cursor-pointer hover:text-yellow-700 transition duration-200 rounded-lg bg-green-100 p-2">
                      Request Rejected!.
                    </button>
                  </div>
                ) : game.requestStatus === 'pending' ? (
                  <div className="text-center py-2">
                    <button className="text-yellow-600 font-semibold cursor-pointer hover:text-yellow-700 transition duration-200 rounded-lg bg-green-100 p-2">
                      Request Pending!.
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoin(game.id)}
                    disabled={game.availableSeats === 0}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${game.availableSeats === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      }`}
                  >
                    {game.availableSeats === 0 ? 'No Seats Available' : 'Request to Join'}
                  </button>
                )}                </div>
            </div>
          ))
          ) : (
            <div className="text-center text-gray-600 p-6">No games available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableGames;