import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import CreateGame from './pages/admin/CreateGame';
import ManageRequests from './pages/admin/ManageRequests';
import MonitorSeats from './pages/admin/MonitorSeats';
import GameControl from './pages/admin/GameControl';

// User Components
import UserAuth from './pages/user/UserAuth';
import UserProfile from './pages/user/UserProfile';
import AvailableGames from './pages/user/AvailableGames';
import RequestPending from './pages/user/RequestPending';
import SeatSelection from './pages/user/SeatSelection';
import PaymentGateway from './pages/user/PaymentGateway';

// Shared Components
import Leaderboard from './pages/Leaderboard';
import PreviousGames from './pages/user/PreviousGames';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminPreviousGames from './pages/admin/adminPrevious';
import ForgotPassword from './pages/user/ForgotPassword';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <Router>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/previous/games" element={<AdminPreviousGames />} />

          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedAdminRoute>
              <AdminProfile />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/create-game" element={
            <ProtectedAdminRoute>
              <CreateGame />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/manage-requests/:gameId" element={
            <ProtectedAdminRoute>
              <ManageRequests />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/monitor-seats/:gameId" element={
            <ProtectedAdminRoute>
              <MonitorSeats />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/game-control/:gameId" element={
            <ProtectedAdminRoute>
              <GameControl />
            </ProtectedAdminRoute>
          } />

          {/* User Routes */}
          <Route path="/" element={<UserAuth />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/games" element={<AvailableGames />} />
          <Route path="/request-pending/:gameId" element={<RequestPending />} />
          <Route path="/select-seat/:gameId" element={<SeatSelection />} />
          <Route path="/payment/:seatId/:gameId" element={<PaymentGateway />} />
          <Route path="/previous/games" element={<PreviousGames />} />
          <Route path="/leaderboard/:gameId" element={<Leaderboard />} />

          {/* Redirect to home if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />


        </Routes>
      </Router>
    </>
  );
};

export default App;
