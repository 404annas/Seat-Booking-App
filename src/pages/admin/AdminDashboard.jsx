import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ListAllGamesAPI } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { IoGameControllerSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showProfileBtn, setShowProfileBtn] = useState(false);
  // Mock data for demonstration
  const [adminProfile, setAdminProfile] = useState({
    username: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator'
  });

  useEffect(() => {
    //fetch admin profile
    const adminData = JSON.parse(localStorage.getItem('user'));
    if (!adminData || adminData.role !== 'admin') {
      navigate('/admin');
    }
    setAdminProfile(adminData);
  }, [])

  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    setLoading(true);
    ListAllGamesAPI().then((res) => {

      if (res && res.length > 0) {
        //count booked seats and pending requests
        const updatedGames = res.map((game) => {
          const bookedSeats = game.seats.filter(seat => seat.isOccupied === true).length;
          const pendingRequests = game.Pending_Requests.length;
          return {
            ...game,
            bookedSeats,
            pendingRequests
          };
        });
        setActiveGames(updatedGames);
      } else {
        toast.error(res.data.message || 'No active games found');
        setActiveGames([]);
      }
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  const handleGameAction = (gameId, action) => {
    switch (action) {
      case 'control':
        navigate(`/admin/game-control/${gameId}`);
        break;
      case 'requests':
        navigate(`/admin/manage-requests/${gameId}`);
        break;
      case 'Leaderboard':
        navigate(`/leaderboard/${gameId}`);
        break;
      default:
        break;
    }
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
      {/* Admin Profile Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {adminProfile.username}</p>
            </div>
            <div className="flex items-center space-x-4">

              <button
                onClick={() => {
                  localStorage.removeItem('userId');
                  localStorage.removeItem('token');
                  localStorage.removeItem('isAdmin');
                  navigate('/admin');
                  toast.success('Logged out successfully');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-gray-700"
              >
                Logout
              </button>
              <div className="relative inline-block">
                {/* Avatar */}
                <div
                  className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer"
                  onClick={() => setShowProfileBtn(prev => !prev)}
                >
                  <button className="text-white font-medium">
                    {adminProfile.username[0]?.toUpperCase()}
                  </button>
                </div>

                {/* My Profile Button (toggle on click) */}
                {showProfileBtn && (
                  <button
                    className="mt-2 absolute left-1/2 -translate-x-1/2 bg-white border border-blue-500 text-blue-600 text-sm px-3 py-1 rounded-md shadow z-10"
                    onClick={() => {
                      navigate('/admin/profile')
                    }}
                  >
                    My Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Games Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Active Games</h2>
          <div className=' flex justify-between items-center gap-1 ' >

            <button
              onClick={() => navigate('/admin/previous/games')}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Previous Games
            </button>
            <button
              onClick={() => navigate('/admin/create-game')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Game
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3   ">
          {
            activeGames.length > 0 ?
              activeGames.map((game) => (
                <div key={game._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{game?.gameName}</h3>
                      <p className="text-sm text-gray-500">
                        Status: <span className={`font-medium ${game.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {game.status}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Seats</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {game.bookedSeats} / {game.totalSeats}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Total Requests:</span>
                      <span className="text-sm font-medium text-yellow-600">{game.pendingRequests}</span>
                    </div>

                    <div className="flex space-x-2">
                      {
                        game.status === 'active' ?

                          <>
                            <div className="relative group inline-block">
                              <button
                                onClick={() => handleGameAction(game._id, 'control')}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                              >
                                <IoGameControllerSharp className="h-5 w-5" />
                              </button>

                              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                Game Control
                              </span>
                            </div>

                            <div className="relative group inline-block">
                              <button
                                onClick={() => handleGameAction(game._id, 'requests')}
                                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                              >
                                <MdManageAccounts className="h-5 w-5" />
                              </button>

                              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                Manage Requests
                              </span>
                            </div>


                          </>
                          :
                          <button
                            onClick={() => handleGameAction(game._id, 'Leaderboard')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                          >
                            View Leaderboard
                          </button>
                      }

                    </div>
                  </div>
                </div>
              ))
              :
              <div className="text-center text-gray-600">
                No active games found
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;