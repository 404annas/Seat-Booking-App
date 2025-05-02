import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Base_URL = import.meta.env.Base_URL || "http://localhost:5001/api";

const PaymentForm = ({ paymentDetails, onSuccess, clientSecret }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const validateCardDetails = () => {
    if (!cardDetails.number || cardDetails.number.length < 16) {
      return 'Invalid card number';
    }
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      return 'Invalid expiry date (MM/YY)';
    }
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      return 'Invalid CVC';
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      // Format expiry date
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substr(0, 5);
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    const validationError = validateCardDetails();
    if (validationError) {
      setError(validationError);
      setProcessing(false);
      return;
    }

    try {
      // Process payment with SwipeSimple
      const response = await axios.post(`${Base_URL}/user/process-payment`, {
        transactionId: clientSecret,
        cardDetails: {
          number: cardDetails.number.replace(/\s/g, ''),
          expiry: cardDetails.expiry.replace(/\//g, ''),
          cvc: cardDetails.cvc
        }
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        // Call the select-seat endpoint
        try {
          const seatResponse = await axios.post(`${Base_URL}/user/select-seat`, {
            gameId: paymentDetails.gameId,
            seatNumber: paymentDetails.seatNumber,
            paymentIntentId: clientSecret
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (seatResponse.data.message === "Seat booked successfully") {
            onSuccess(seatResponse.data);
          } else {
            setError('Failed to book seat');
          }
        } catch (err) {
          setError('Failed to book seat: ' + (err.response?.data?.message || err.message));
        }
      } else {
        setError('Payment failed: ' + response.data.message);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            type="text"
            name="number"
            value={cardDetails.number}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            maxLength="19"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="text"
              name="expiry"
              value={cardDetails.expiry}
              onChange={handleInputChange}
              placeholder="MM/YY"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              maxLength="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CVC</label>
            <input
              type="text"
              name="cvc"
              value={cardDetails.cvc}
              onChange={handleInputChange}
              placeholder="123"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              maxLength="3"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={processing}
        className={`w-full py-3 rounded-md text-white ${
          processing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        {processing ? 'Processing...' : `Pay $${paymentDetails.price}`}
      </button>
    </form>
  );
};

const PaymentGateway = () => {
  const navigate = useNavigate();
  const { seatId, gameId } = useParams();
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [paymentDetails, setPaymentDetails] = useState({
    seatNumber: parseInt(seatId),
    gameId: gameId,
    price: 0,
    hasGift: true,
    giftDetails: 'Special Prize'
  });

  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${Base_URL}/user/create-payment-intent`, {
          gameId: gameId,
          seatNumber: seatId
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        setClientSecret(response.data.clientSecret);
        setPaymentDetails(prev => ({
          ...prev,
          price: response.data.amount
        }));
      } catch (err) {
        setError('Failed to initialize payment: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [gameId, seatId]);

  const handlePaymentSuccess = (data) => {
    setPaymentStatus('success');
    setTimeout(() => {
      navigate(`/leaderboard/${gameId}`);
    }, 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h1>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Seat Number:</span>
            <span className="font-semibold">{paymentDetails.seatNumber}</span>
          </div>
          
          {paymentStatus === 'pending' && (
            <div className="text-center py-4">
              <p className="text-gray-600">Ready to reveal your seat price?</p>
              <p className="text-sm text-gray-500 mt-2">Enter your card details below to proceed with payment</p>
            </div>
          )}

          {paymentDetails.hasGift && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-800 font-medium">Special Gift Included!</p>
              <p className="text-yellow-600 text-sm mt-1">{paymentDetails.giftDetails}</p>
            </div>
          )}
        </div>

        {paymentStatus === 'pending' && clientSecret && (
          <PaymentForm 
            paymentDetails={paymentDetails}
            onSuccess={handlePaymentSuccess}
            clientSecret={clientSecret}
          />
        )}

        {paymentStatus === 'success' && (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Your seat has been booked successfully.</p>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-800 font-medium">Your Seat Price:</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">${paymentDetails.price}</p>
            </div>

            {paymentDetails.hasGift && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <p className="text-green-800 font-medium">Congratulations!</p>
                <p className="text-green-600 text-sm mt-1">You've received: {paymentDetails.giftDetails}</p>
              </div>
            )}
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600">Please try again or contact support.</p>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway; 