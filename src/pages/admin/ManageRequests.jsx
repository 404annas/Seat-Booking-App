import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetGameById, RequestStatusUpdate } from '../../API_handler';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const ManageRequests = () => {
  // Mock data for demonstration
  const { gameId } = useParams();
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [update, setupdate] = useState(false);


  const handleApprove = (id) => {
    setLoading(true);
    RequestStatusUpdate(id, 'approved').then((res) => {
      if (res && res.status === 200) {
        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
        toast.success(res.data.message);
        setupdate(!update);
      } else {
        console.error("Error in approving the request");
        toast.error("Error in approving the request");
      }
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  const handleReject = (id) => {
    setLoading(true);
    RequestStatusUpdate(id, 'rejected').then((res) => {
      if (res && res.status === 200) {
        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
        toast.success(res.data.message);
        setupdate(!update);

      } else {
        console.error("Error in rejecting the request");
        toast.error("Error in rejecting the request");
      }
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    GetGameById(gameId).then((res) => {
      if (res && res.data.Pending_Requests.length > 0) {
        const updatedRequests = res.data.Pending_Requests.map((request) => {
          return {
            id: request._id,
            userName: request.userId.username,
            gameName: res.data.gameName,
            status: request.status
          };
        });
        setRequests(updatedRequests);
      } else {
        toast.error('No requests found!');
        setRequests([]);
      }
    }).catch((err) => {
      console.error(err);
      setRequests([]);
    })
  }, [update]);

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

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Player Requests</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className=' bg-black text-white w-24 h-10 rounded-lg  '
          >Back</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length > 0 ?
                requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.gameName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className=" flex space-x-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="4" className="text-center text-gray-600">
                    No requests found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;