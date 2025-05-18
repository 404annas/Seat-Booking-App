import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetLeaderboardAPI } from '../API_handler';
import Loader from '../components/Loader/Loader';
const Leaderboard = () => {
  const { gameId } = useParams(); // Assuming you are using react-router-dom for routing
  const navigate = useNavigate();
  // Mock data for demonstration
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const isadmin = localStorage.getItem("isAdmin")
    if (isadmin == 'true') setAdmin(true);
  }, [])

  useEffect(() => {
    setLoading(true);
    GetLeaderboardAPI(gameId).then((res) => {
      console.log(res.data)
      if (res && res.data.length > 0) {
        const updatedLeaderboard = res.data.map((user) => {
          return {
            id: user.seatId,
            userName: user?.user?.username,
            seatNumber: user.seatNumber,
          };
        });

        setLeaderboardData(updatedLeaderboard);
      } else {
        setLeaderboardData([]);
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Game Leaderboard</h1>
          <button
            onClick={() => isAdmin ? navigate('/admin/dashboard') : navigate('/games')}
            className=' bg-black text-white w-24 h-10 rounded-lg  '
          >Back</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.seatNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Game Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600">Total Players</p>
              <p className="text-xl font-bold text-blue-800">{leaderboardData.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 