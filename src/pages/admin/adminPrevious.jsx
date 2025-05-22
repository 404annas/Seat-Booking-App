import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllNonActiveGames } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { MdEventSeat } from 'react-icons/md';

const AdminPreviousGames = () => {
  const navigate = useNavigate();
  // Mock data for demonstration
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
          description: game?.description,
          additionalInfo: game?.additionalInfo,
          totalSeats: game.totalSeats,
          status: game.status,
          startTime: game?.startTime,
          endTime: game?.endTime
        })));
      } else {
        toast.error('Error fetching games');
      }
    }).finally(() => {
      setLoading(false);
    });
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
            onClick={() => navigate('/admin/dashboard')}
            className="bg-black text-white w-24 h-10 rounded-lg"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {game.gameImage ? (
                  <div className="w-full h-48 relative overflow-hidden group">
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

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Total Seats:</span> {game.totalSeats}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span>{' '}
                      <span className={game.status === 'ended' ? 'text-red-600' : 'text-green-600'}>
                        {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                      </span>
                    </div>
                    {game.startTime && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Started:</span>{' '}
                        {new Date(game.startTime).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/admin/view-bookings/${game.id}`)}
                      className="w-full px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-200 text-center"
                    >
                      Declare Winners
                    </button>
                    {game.status === 'ended' && (
                      <button
                        onClick={() => navigate(`/leaderboard/${game.id}`)}
                        className="w-full px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
                      >
                        View Leaderboard
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No previous games available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPreviousGames;