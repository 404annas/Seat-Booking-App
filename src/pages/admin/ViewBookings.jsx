import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListAllSeats } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import { FaUserAlt, FaCalendarAlt } from 'react-icons/fa';
import { MdEventSeat } from 'react-icons/md';
import { IoMdArrowBack } from 'react-icons/io';
import toast from 'react-hot-toast';

const ViewBookings = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    setLoading(true);
    ListAllSeats(gameId)
      .then((response) => {
        if (response.status === 200) {
          console.log('Seats data:', response.data);
          const bookedSeats = response.data
            .filter(seat => seat.isOccupied && seat.userId)
            .map(seat => ({
              seatNumber: seat.seatNumber,
              userName: seat.userId.username,
              bookedAt: new Date(seat.BookedAt).toLocaleString(),
              price: seat.price
            }));
          setSeats(bookedSeats);
        } else {
          toast.error('Failed to fetch booking data');
        }
      })
      .catch((error) => {
        console.error('Error fetching seats:', error);
        toast.error('Error loading booking data');
      })
      .finally(() => {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Seat Bookings</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <IoMdArrowBack className="h-5 w-5" />
            Back
          </button>
        </div>

        {seats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seats.map((seat) => (
              <div
                key={seat.seatNumber}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <MdEventSeat className="h-6 w-6" />
                    <span className="font-semibold">Seat {seat.seatNumber}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    ₹{seat.price}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FaUserAlt className="h-4 w-4 mr-2" />
                    <span>{seat.userName}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="h-4 w-4 mr-2" />
                    <span className="text-sm">{seat.bookedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No bookings found for this game.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookings;
