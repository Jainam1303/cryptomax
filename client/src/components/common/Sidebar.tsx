import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X, Home, TrendingUp, Wallet, User, Settings } from 'lucide-react';
import { RootState } from '../../redux/store';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={clsx(
          "fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-dark-200 shadow-sidebar transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-primary-500 font-bold text-xl">CryptoInvest</span>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-4 py-6">
          <nav className="space-y-1">
            <SidebarLink to="/dashboard" icon={<Home className="h-5 w-5" />}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/invest" icon={<TrendingUp className="h-5 w-5" />}>
              Invest
            </SidebarLink>
            <SidebarLink to="/wallet" icon={<Wallet className="h-5 w-5" />}>
              Wallet
            </SidebarLink>
            <SidebarLink to="/profile" icon={<User className="h-5 w-5" />}>
              Profile
            </SidebarLink>
            {user?.role === 'admin' && (
              <SidebarLink to="/admin" icon={<Settings className="h-5 w-5" />}>
                Admin
              </SidebarLink>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => clsx(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-primary-50 text-primary-500 dark:bg-primary-900/20 dark:text-primary-400"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300"
      )}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </NavLink>
  );
};

export default Sidebar;