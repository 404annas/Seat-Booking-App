import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListAllSeats, testBookSeat } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

const SeatSelection = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loading, setLoading] = useState(false);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [showTestBookDialog, setShowTestBookDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId'));
  const [userHasBooking, setUserHasBooking] = useState(false);

  const [seats, setSeats] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      status: 'available', // available, selected, booked
      price: 100,
      userId: null
    }))
  );

  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatClick = (seatId) => {
    if (userHasBooking) {
      toast.error('You have already booked a seat in this game');
      return;
    }

    const seat = seats.find(seat => seat.id === seatId);
    if (seat.status === 'available') {
      setSelectedSeat(parseInt(seatId));
    }
  };

  useEffect(() => {
    setLoading(true);
    ListAllSeats(gameId)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const data = response.data;
          const userSeat = data.find(seat => seat.userId?._id === currentUserId);
          const hasBooking = !!userSeat;

          const updatedSeats = data.map((seat) => ({
            id: seat.seatNumber,
            status: hasBooking && !seat.isOccupied ? 'unavailable' :
              seat.isOccupied ? 'booked' : 'available',
            price: seat.price,
            userId: seat.userId?._id || null
          }));

          setSeats(updatedSeats);
          setUserHasBooking(hasBooking);

          if (userSeat) {
            toast.error('You have already booked Seat ' + userSeat.seatNumber + ' in this game');
            setSelectedSeat(null);
          }
        } else {
          console.error('Error fetching seats:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching seats:', error);
      }).finally(() => {
        setLoading(false);
      })
  }, [gameId, currentUserId]);

  const refreshSeatsData = async () => {
    try {
      const seatsResponse = await ListAllSeats(gameId);
      if (seatsResponse.status === 200) {
        const updatedSeats = seatsResponse.data.map((seat) => ({
          id: seat.seatNumber,
          status: seat.isOccupied ? 'booked' : 'available',
          price: seat.price,
          userId: seat.userId?._id || null
        }));
        setSeats(updatedSeats);

        // Check if user now has a booking
        const userSeat = updatedSeats.find(seat => seat.userId === currentUserId);
        setUserHasBooking(!!userSeat);
        if (userSeat) {
          setSelectedSeat(null);
        }
      }
    } catch (error) {
      console.error('Error refreshing seats:', error);
      toast.error('Failed to refresh seat data');
    }
  };

  const handleTestBooking = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat first');
      return;
    }

    if (userHasBooking) {
      toast.error('You have already booked a seat in this game');
      return;
    }

    const seatToBook = seats.find((seat) => seat.id === selectedSeat);
    if (seatToBook.status === 'booked') {
      toast.error('This seat is already booked. Please select another seat.');
      return;
    }

    setShowTestBookDialog(true);
  };

  const confirmTestBooking = async () => {
    setLoading(true);
    try {
      const response = await testBookSeat(gameId, selectedSeat);
      if (response.status === 200) {
        toast.success('Seat booked successfully (TEST MODE)');
        await refreshSeatsData();
      } else {
        toast.error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Test booking error:', error);
      toast.error(error.response?.data?.message || 'Error in test booking');
    } finally {
      setLoading(false);
      setShowTestBookDialog(false);
    }
  };
  const handleBookSeat = () => {
    if (!selectedSeat) {
      toast.error('Please select a seat first');
      return;
    }

    if (userHasBooking) {
      toast.error('You have already booked a seat in this game');
      return;
    }

    const seatToBook = seats.find((seat) => seat.id === selectedSeat);
    if (seatToBook.status === 'booked') {
      toast.error('This seat is already booked. Please select another seat.');
      return;
    }

    setShowBookDialog(true);
  };

  const confirmBookSeat = () => {
    console.log(`Booking seat ${selectedSeat}`);
    navigate(`/payment/${selectedSeat}/${gameId}`);
  }; const getSeatColor = (seat, isUsersBookedSeat, isSelected) => {
    if (isUsersBookedSeat) {
      return 'bg-blue-600'; // User's booked seat
    }
    if (seat.status === 'booked') {
      return 'bg-red-500'; // Someone else's booked seat
    }
    if (seat.status === 'unavailable') {
      return 'bg-gray-400'; // Seats unavailable due to user having booked
    }
    if (isSelected && seat.status === 'available') {
      return 'bg-yellow-500'; // Selected seat
    }
    return 'bg-green-500'; // Available seat
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  } return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ConfirmDialog
        isOpen={showBookDialog}
        onClose={() => setShowBookDialog(false)}
        onConfirm={confirmBookSeat}
        title="Confirm Seat Booking"
        message={`Are you sure you want to book Seat ${selectedSeat}? You will be redirected to the payment page.`}
      />
      <ConfirmDialog
        isOpen={showTestBookDialog}
        onClose={() => setShowTestBookDialog(false)}
        onConfirm={confirmTestBooking}
        title="Confirm Test Booking"
        message={`Are you sure you want to test book Seat ${selectedSeat}? (No payment required)`}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Your Seat</h1>
          <button
            onClick={() => navigate('/games')}
            className=' bg-black text-white w-24 h-10 rounded-lg  '
          >Back</button>
        </div>        <div className="grid grid-cols-3 gap-2 mb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">          {seats.map((seat) => {
          const isBooked = seat.status === 'booked';
          const isUsersBookedSeat = seat.userId === currentUserId;
          const isSelected = selectedSeat === seat.id;

          // All seats should be disabled if user has a booking or if the seat is already booked
          const isDisabled = userHasBooking || isBooked;

          // Only allow clicking if the seat is not disabled
          const handleClick = () => {
            if (!isDisabled) {
              handleSeatClick(seat.id);
            } else if (userHasBooking) {
              toast.error('You have already booked a seat in this game');
            }
          }; return (
            <div
              key={seat.id}
              onClick={handleClick}
              className={`p-4 rounded-lg text-white text-center transition-all 
                  ${getSeatColor(seat, isUsersBookedSeat, isSelected)}
                  ${seat.status !== 'available' || (userHasBooking && !isUsersBookedSeat)
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'hover:opacity-90 cursor-pointer'}`}
              title={
                isUsersBookedSeat
                  ? 'Your booked seat'
                  : isBooked
                    ? 'This seat is already taken'
                    : userHasBooking
                      ? 'You have already booked Seat ' + seats.find(s => s.userId === currentUserId)?.id
                      : 'Available'
              }
            >
              <div className="font-bold">Seat {seat.id}</div>
              {isBooked && (
                <div className="text-xs mt-1 opacity-80">
                  {isUsersBookedSeat ? 'Your Seat' : 'Booked'}
                </div>
              )}
            </div>
          );
        })}
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 opacity-70 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          {userHasBooking && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Your Seat</span>
            </div>
          )}
          {userHasBooking && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 opacity-70 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Unavailable</span>
            </div>
          )}
        </div>

        {selectedSeat && (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Selected Seat: {selectedSeat}
            </p>
            <p className="text-gray-600 mb-4">
              {userHasBooking
                ? "You have already booked a seat in this game"
                : "Surprise Price! Click below to reveal."}
            </p>
            <div className="space-y-4">
              <button
                onClick={handleBookSeat}
                disabled={userHasBooking}
                className={`w-full px-6 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${userHasBooking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
              >
                {userHasBooking ? 'Already Booked' : 'Proceed to Payment'}
              </button>

              {/* Test Booking Button - Remove in production */}
              <button
                onClick={handleTestBooking}
                disabled={userHasBooking}
                className={`w-full px-6 py-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${userHasBooking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                  }`}
              >
                {userHasBooking ? 'Already Booked' : 'Test Book Seat (No Payment)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;