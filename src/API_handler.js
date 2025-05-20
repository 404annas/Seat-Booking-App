const Base_URL = import.meta.env.VITE_Base_URL || "http://localhost:5001/api";
import axios from "axios";

//user login and register
export const UserLogin = async (userData) => {
  try {

    const res = await axios.post(`${Base_URL}/user/login`,
      userData
    )
    return res;
  } catch (error) {
    return error.response;
  }
}

export const UserRegister = async (userData) => {
  try {
    const res = await axios.post(`${Base_URL}/user/register`,
      userData
    )
    return res;
  } catch (error) {
    return error.response;
  }
}

export const forgotPassword = async (email, role = 'user') => {
  try {
    const res = await axios.post(`${Base_URL}/user/forgot-password`, { email, role });
    return res;
  } catch (error) {
    return error.response;
  }
}

export const verifyOTP = async (email, otp) => {
  try {
    const res = await axios.post(`${Base_URL}/user/verify-otp`, { email, otp });
    return res;
  } catch (error) {
    return error.response;
  }
}

export const resetPassword = async (newPassword, tempToken) => {
  try {
    const res = await axios.post(
      `${Base_URL}/user/reset-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${tempToken}`
        }
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
}

export const testBookSeat = async (gameId, seatNumber) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      `${Base_URL}/user/test-book-seat`,
      { gameId, seatNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
}

export const UserRequest = async (userData) => {
  try {
    const res = await axios.post(`${Base_URL}/user/request`,
      userData
    )
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const GetAllActiveGames = async () => {
  try {
    const res = await axios.get(`${Base_URL}/game/listActiveGames`)
    return res;
  } catch (error) {
    return error.response;
  }
}

export const GetAllNonActiveGames = async () => {
  try {
    const res = await axios.get(`${Base_URL}/game/listNonActiveGames`)
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const CreateGameAPI = async (gameData) => {
  try {
    const res = await axios.post(`${Base_URL}/admin/createGame`,
      gameData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const ListAllGamesAPI = async () => {
  try {
    const res = await axios.get(`${Base_URL}/admin/listAllGames`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const GetGameById = async (gameId) => {
  try {
    const res = await axios.get(`${Base_URL}/game/getGameById/${gameId}`)
    return res;
  } catch (error) {
    return error.response;
  }
}

export const EndGameManually = async (gameId) => {
  try {
    const res = await axios.post(`${Base_URL}/admin/endGame/${gameId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data;
  } catch (error) {
    return error.response;
  }
}

export const RequestStatusUpdate = async (requestId, status) => {
  try {
    const res = await axios.post(`${Base_URL}/admin/update/requestStatus/${requestId}`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

export const ListAllSeats = async (gameId) => {
  try {
    const res = await axios.get(`${Base_URL}/admin/listAllSeats/${gameId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res;
  }
  catch (error) {
    console.log(error);
  }
}

export const GetLeaderboardAPI = async (gameId) => {
  try {
    const res = await axios.get(`${Base_URL}/game/leaderboard/${gameId}`)
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const MakeRequestAPI = async (gameId) => {
  try {
    const res = await axios.post(`${Base_URL}/user/request`,
      { gameId },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res;
  } catch (error) {
    return error.response;
  }
}

export const UpdateUserProfile = async (userData) => {
  try {
    const res = await axios.put(`${Base_URL}/user/update-profile`,
      userData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const UpdateAdminProfile = async (userData) => {
  try {
    const res = await axios.put(`${Base_URL}/admin/update-profile`,
      userData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadImage = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      `${Base_URL}/admin/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};