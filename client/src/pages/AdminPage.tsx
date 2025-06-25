import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import WithdrawalRequests from '../components/admin/WithdrawalRequests';
import ProfitLossSettings from '../components/admin/ProfitLossSettings';
import SystemSettings from '../components/admin/SystemSettings';
import Sidebar from '../components/common/Sidebar';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="admin-page">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="admin-content">
        <div className="mobile-header">
          <button className="menu-button" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <h1>Admin</h1>
        </div>
        
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <p>Manage the platform and user accounts.</p>
        </div>
        
        <div className="admin-navigation">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Users
          </NavLink>
          <NavLink to="/admin/withdrawals" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Withdrawals
          </NavLink>
          <NavLink to="/admin/profit-loss" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Profit/Loss
          </NavLink>
          <NavLink to="/admin/system" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            System
          </NavLink>
        </div>
        
        <div className="admin-routes">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/withdrawals" element={<WithdrawalRequests />} />
            <Route path="/profit-loss" element={<ProfitLossSettings />} />
            <Route path="/system" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;