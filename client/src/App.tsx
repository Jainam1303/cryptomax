import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/thunks/authThunks';
import { setAuthToken } from './services/api';
import { ThemeProvider } from './context/ThemeContext';
import { RootState, AppDispatch } from './redux/store';

// Components
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import InvestPage from './pages/InvestPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import CryptoDetailPage from './pages/CryptoDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Set auth token in axios headers
      setAuthToken(token);
      // Load user data
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Navbar />
      <main className="min-h-screen bg-light-200 dark:bg-dark-100 text-gray-900 dark:text-white pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/invest" element={
            <PrivateRoute>
              <InvestPage />
            </PrivateRoute>
          } />
          <Route path="/crypto/:id" element={
            <PrivateRoute>
              <CryptoDetailPage />
            </PrivateRoute>
          } />
          <Route path="/wallet" element={
            <PrivateRoute>
              <WalletPage />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
};

export default App;