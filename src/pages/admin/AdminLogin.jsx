import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLogin } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'admin', // Default role set to 'admin'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle login logic here
    UserLogin(credentials).then((res) => {
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('isAdmin', "true");
        navigate('/admin/dashboard');
        toast.success("Login successful");
      } else {
        toast.error(res.data.message);
      }
    }).finally(() => {
      setLoading(false);
    })
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
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              email
            </label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 *
               border-2 p-2
              "
              placeholder="Enter your email"
              required
            />
          </div>          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>          <div className="mt-4 space-y-2">
            <p className="text-sm text-center text-gray-600">
              Forgot Password?{' '}
              <a href="/admin/forgot-password" className="text-blue-600 hover:underline">
                Reset Here
              </a>
            </p>
            <p className="text-sm text-center text-gray-600">
              Not an Admin?{' '}
              <a href="/" className="text-blue-600 hover:underline">
                Go to User Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 