import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListAllSeats, declareWinners } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import { FaUserAlt, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import { MdEventSeat } from 'react-icons/md';
import { IoMdArrowBack } from 'react-icons/io';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

const ViewBookings = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  useEffect(() => {
    loadSeats();
  }, [gameId]);

  const loadSeats = () => {
    setLoading(true);
    ListAllSeats(gameId)
      .then((response) => {
        if (response.status === 200) {
          console.log('Seats data:', response);
          setGameStatus(response.data.GameStatus);
          const bookedSeats = response.data.seats
            .filter(seat => seat.isOccupied && seat.userId)
            .map(seat => ({
              id: seat._id,
              seatNumber: seat.seatNumber,
              userName: seat.userId.username,
              bookedAt: new Date(seat.BookedAt).toLocaleString(),
              price: seat.price,
              isWinner: seat.isWinner,
              declaredWinnerAt: seat.declaredWinnerAt ? new Date(seat.declaredWinnerAt).toLocaleString() : null
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
  };

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleDeclareWinners = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to declare as winner');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmDeclareWinners = async () => {
    setLoading(true);
    try {
      const response = await declareWinners(gameId, selectedSeats);
      if (response.status === 200) {
        toast.success('Winners declared successfully!');
        setSelectedSeats([]);
        await loadSeats(); // Refresh the seat list
      } else {
        toast.error(response.data?.message || 'Failed to declare winners');
      }
    } catch (error) {
      console.error('Error declaring winners:', error);
      toast.error('Error declaring winners');
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDeclareWinners}
        title="Confirm Winners"
        message={`Are you sure you want to declare ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} as winner${selectedSeats.length > 1 ? 's' : ''}? This action cannot be undone.`}
      />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Seat Bookings</h1>
          <div className="flex gap-4">
            {selectedSeats.length > 0 && (
              <button
                onClick={handleDeclareWinners}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <FaTrophy className="h-5 w-5" />
                Declare Winners ({selectedSeats.length})
              </button>
            )}
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <IoMdArrowBack className="h-5 w-5" />
              Back
            </button>
          </div>
        </div>

        {gameStatus == 'ended' && <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">How to Declare Winners</h2>
          <ul className="text-blue-600 space-y-1 list-disc list-inside">
            <li>Click on any booked seat card to select it (green border indicates selection)</li>
            <li>You can select multiple seats to declare multiple winners at once</li>
            <li>Click again on a selected seat to deselect it</li>
            <li>Click "Declare Winners" button when you're ready</li>
            <li>Winners will be notified via email automatically</li>
          </ul>
        </div>
        }
        {seats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seats.map((seat) => (
              <div
                key={seat.id}
                onClick={() => !seat.isWinner && handleSeatSelect(seat.id)}
                className={`bg-white border  rounded-lg p-6 shadow-sm hover:shadow-md transition-all   ${selectedSeats.includes(seat.id)
                  ? 'border-green-500 ring-2 ring-green-500'
                  : seat.isWinner
                    ? 'border-yellow-500 ring-2 ring-yellow-500 cursor-not-allowed '
                    : 'border-gray-200 cursor-pointer '
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <MdEventSeat className="h-6 w-6" />
                    <span className="font-semibold">Seat {seat.seatNumber}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      ₹{seat.price}
                    </span>
                    {seat.isWinner && (
                      <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <FaTrophy className="h-4 w-4" />
                        Winner
                      </span>
                    )}
                  </div>
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

                  {seat.declaredWinnerAt && (
                    <div className="flex items-center text-yellow-600">
                      <FaTrophy className="h-4 w-4 mr-2" />
                      <span className="text-sm">Won on: {seat.declaredWinnerAt}</span>
                    </div>
                  )}
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
