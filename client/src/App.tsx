import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/thunks/authThunks';
import { setAuthToken } from './services/api';
import { ThemeProvider } from './context/ThemeContext';
import { RootState, AppDispatch } from './redux/store';

import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

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
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token); // 🔐 sets token in Axios
      dispatch(loadUser());
    }
  }, [dispatch]);

  console.log("✅ App loaded at", window.location.pathname);

  return (
    <ThemeProvider>
      <Navbar />
      <main className="min-h-screen bg-light-200 dark:bg-dark-100 text-gray-900 dark:text-white pt-16 px-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/invest" element={<PrivateRoute><InvestPage /></PrivateRoute>} />
          <Route path="/crypto/:id" element={<PrivateRoute><CryptoDetailPage /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><WalletPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
};

export default App;
