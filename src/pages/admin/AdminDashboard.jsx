import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ListAllGamesAPI } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { IoGameControllerSharp } from "react-icons/io5";
import { MdManageAccounts, MdEventSeat } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

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
        const updatedGames = res.map((game) => ({
          _id: game._id,
          gameName: game.gameName,
          status: game.status,
          gameImage: game.gameImage,
          totalSeats: game.totalSeats,
          bookedSeats: game.seats.filter(seat => seat.isOccupied === true).length,
          pendingRequests: game.Pending_Requests.length
        }));
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
      case 'viewBookings':
        navigate(`/admin/view-bookings/${gameId}`);
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
              {/* Profile and Logout buttons */}
              <div className="relative group">
                (
                <button
                  onClick={() => {
                    navigate('/admin/profile')
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group relative"
                >
                  <CgProfile className='h-7 w-7' />
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    My Profile
                  </span>
                </button>
                )
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem('userId');
                  localStorage.removeItem('token');
                  localStorage.removeItem('isAdmin');
                  navigate('/control/admin/secure-7845799');
                  toast.success('Logged out successfully');
                }}
                className="relative group text-red-500 hover:text-red-700"
              >
                <IoLogOutOutline className='h-7 w-7' />
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Games Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Active Games</h2>
          <div className='flex justify-between items-center gap-4'>
            <button
              onClick={() => navigate('/admin/previous/games')}
              className="group relative bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <FaHistory className='h-5 w-5' />
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Previous Games
              </span>
            </button>

            <button
              onClick={() => navigate('/admin/create-game')}
              className="group relative bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Game
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeGames.length > 0 ? (
            activeGames.map((game) => (<div key={game._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {game.gameImage ? (
                <div className="w-full h-48 relative overflow-hidden group">
                  <img
                    src={game.gameImage}
                    alt={game.gameName}
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
                    {game.status === 'active' ? (
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

                        <div className="relative group inline-block">
                          <button
                            onClick={() => handleGameAction(game._id, 'viewBookings')}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                          >
                            <MdEventSeat className="h-5 w-5" />
                          </button>
                          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            View Bookings
                          </span>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleGameAction(game._id, 'Leaderboard')}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                      >
                        View Leaderboard
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              No active games found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;