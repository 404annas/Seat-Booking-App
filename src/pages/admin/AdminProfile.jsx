import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { UpdateAdminProfile } from '../../API_handler';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    role: 'admin'
  });
  const [updateData, setUpdateData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'admin') {
      navigate('/admin');
      return;
    }
    setProfile(userData);
    setUpdateData({
      username: userData.username,
      email: userData.email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (updateData.newPassword !== updateData.confirmNewPassword) {
      toast.error("New passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      const response = await UpdateAdminProfile({
        username: updateData.username,
        email: updateData.email,
        currentPassword: updateData.currentPassword,
        newPassword: updateData.newPassword || undefined
      });
      
      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setProfile(user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
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
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-3xl font-semibold">
                  {profile.username?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                  {profile.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                  {profile.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                  {profile.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={updateData.username}
                onChange={(e) => setUpdateData({ ...updateData, username: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={updateData.email}
                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={updateData.currentPassword}
                onChange={(e) => setUpdateData({ ...updateData, currentPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
              <input
                type="password"
                value={updateData.newPassword}
                onChange={(e) => setUpdateData({ ...updateData, newPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={updateData.confirmNewPassword}
                onChange={(e) => setUpdateData({ ...updateData, confirmNewPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;