const Base_URL =  import.meta.env.VITE_Base_URL  || "http://localhost:5001/api"; 
import axios from "axios";
console.log(import.meta.env.VITE_Base_URL );

//user login and register
export const UserLogin = async (userData) => {
  try {

    const res = await axios.post(`${Base_URL}/user/login`,
      userData
    )
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const UserRegister = async (userData) => {
  try {
    const res = await axios.post(`${Base_URL}/user/register`,
      userData
    )
    return res;
  } catch (error) {
    console.log(error);
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
    console.log(error);
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

export const ListAllGamesAPI = async()=>{
  try {
    const res = await axios.get(`${Base_URL}/admin/listAllGames`,
      {
        headers:{
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
    console.log(error);
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
    console.log(error);
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
   return error
  }
}