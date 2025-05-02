import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLogin, UserRegister } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
const UserAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role : 'user'
  });
  const [loading, setLoading] = useState(false);

  //check if the user is already logged in
  useEffect(()=>{
   const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    if(token && isAdmin === 'false'){
      navigate('/games');
    }else if(token && isAdmin === 'true'){
      navigate('/admin/dashboard');
    }
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if( isLogin && !formData.username || !formData.password) {
      alert("Please fill all the fields!");
      return;
    }

    if(!isLogin && !formData.confirmPassword) {
      alert("Please confirm your password!");
      return;
    }

    if(isLogin) {
      setLoading(true);
      UserLogin(formData).then((res)=>{
       if(res.status === 200) {
         localStorage.setItem('token', res.data.token);
         localStorage.setItem('isAdmin', "false");
          localStorage.setItem('userId', res.data.user.id);
         navigate('/games');
         alert("User logged in successfully!");
        }else{
          alert("User login failed!");
        }
      }).catch(e=>{
        alert("User login failed!");
        console.log(e);
      }).finally(()=>{
        setLoading(false);
      })
    }

    if(!isLogin) {
      setLoading(true);
      UserRegister(formData).then((res)=>{
       if(res.status === 201) {
          alert("User registered successfully!");
          setIsLogin(true);
        }
        else {
          alert("User registration failed!");
        }
      }).finally(()=>{
        setLoading(false);
      })
    }
    // Handle authentication logic here
    // For demo purposes, we'll just navigate to the games page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? 'User Login' : 'User Registration'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-200 border-2 p-2"
              required
              placeholder="Enter your username"
            />
          </div>
    { !isLogin &&  <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-200 border-2 p-2"
              required
              placeholder="Enter your email"
            />
          </div>}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-200 border-2 p-2 "
              required
              placeholder='Enter Your Password'
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-200 border-2 p-2 "
                required
                placeholder='Confirm Your Password'
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center flex justify-between">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
          Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAuth; 