import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListAllSeats, testBookSeat } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
const SeatSelection = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const [seats, setSeats] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      status: 'available', // available, selected, booked
      price: 100
    }))
  );

  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatClick = (seatId) => {
    if (seats[seatId - 1].status === 'available') {
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
          const updatedSeats = data.map((seat) => ({
            id: seat.seatNumber,
            status: seat.isOccupied ? 'booked' : 'available',
            price: seat.price
          }));
          setSeats(updatedSeats);
        } else {
          console.error('Error fetching seats:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching seats:', error);
      }).finally(() => {
        setLoading(false);
      })
  }, [])
  const handleTestBooking = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat first');
      return;
    }

    const seatToBook = seats.find((seat) => seat.id === selectedSeat);
    if (seatToBook.status === 'booked') {
      toast.error('This seat is already booked. Please select another seat.');
      return;
    }

    setLoading(true);
    try {
      const response = await testBookSeat(gameId, selectedSeat);
      if (response.status === 200) {
        toast.success('Seat booked successfully (TEST MODE)');
        // Refresh seats data
        const seatsResponse = await ListAllSeats(gameId);
        if (seatsResponse.status === 200) {
          const updatedSeats = seatsResponse.data.map((seat) => ({
            id: seat.seatNumber,
            status: seat.isOccupied ? 'booked' : 'available',
            price: seat.price
          }));
          setSeats(updatedSeats);
        }
        setSelectedSeat(null);
      } else {
        toast.error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Test booking error:', error);
      toast.error(error.response?.data?.message || 'Error in test booking');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSeat = () => {
    if (selectedSeat) {
      // Handle booking logic here

      //check if the seat is already booked
      const seatToBook = seats.find((seat) => seat.id === selectedSeat);
      if (seatToBook.status === 'booked') {
        toast.error('This seat is already booked. Please select another seat.');
        return;
      }

      console.log(`Booking seat ${selectedSeat}`);
      // Navigate to payment page
      navigate(`/payment/${selectedSeat}/${gameId}`);
    }
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-red-500';
      case 'selected':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Your Seat</h1>
          <button
            onClick={() => navigate('/games')}
            className=' bg-black text-white w-24 h-10 rounded-lg  '
          >Back</button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4 cursor-pointer sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  ">
          {seats.map((seat) => (
            <div
              key={seat.id}
              onClick={() => handleSeatClick(seat.id)}
              className={`p-4 rounded-lg text-white text-center cursor-pointer transition-colors
                ${getSeatColor(seat.status)} hover:opacity-90`}
            >
              <div className="font-bold">Seat {seat.id}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
        </div>

        {selectedSeat && (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Selected Seat: {selectedSeat}
            </p>
            <p className="text-gray-600 mb-4">
              Surprise Price! Click below to reveal.
            </p>            <div className="space-y-4">
              <button
                onClick={handleBookSeat}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Proceed to Payment
              </button>

              {/* Test Booking Button - Remove in production */}
              <button
                onClick={handleTestBooking}
                className="block w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Test Book Seat (No Payment)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection; 