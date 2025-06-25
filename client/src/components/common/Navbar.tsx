import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, User, LogOut } from 'lucide-react';
import { logout } from '../../redux/thunks/authThunks';
import { RootState, AppDispatch } from '../../redux/store';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenus();
  };

  return (
    <nav className="bg-white dark:bg-dark-200 shadow-nav fixed top-0 left-0 right-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenus}>
              <span className="text-primary-500 font-bold text-xl">CryptoInvest</span>
            </Link>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <NavLink to="/dashboard" currentPath={location.pathname}>Dashboard</NavLink>
                <NavLink to="/invest" currentPath={location.pathname}>Invest</NavLink>
                <NavLink to="/wallet" currentPath={location.pathname}>Wallet</NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" currentPath={location.pathname}>Admin</NavLink>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    id="user-menu-button"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      {user?.name?.charAt(0) || <User size={16} />}
                    </div>
                  </button>
                </div>
                
                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300"
                      role="menuitem"
                      onClick={closeMenus}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300"
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
            
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/dashboard" currentPath={location.pathname} onClick={closeMenus}>Dashboard</MobileNavLink>
                <MobileNavLink to="/invest" currentPath={location.pathname} onClick={closeMenus}>Invest</MobileNavLink>
                <MobileNavLink to="/wallet" currentPath={location.pathname} onClick={closeMenus}>Wallet</MobileNavLink>
                <MobileNavLink to="/profile" currentPath={location.pathname} onClick={closeMenus}>Profile</MobileNavLink>
                {user?.role === 'admin' && (
                  <MobileNavLink to="/admin" currentPath={location.pathname} onClick={closeMenus}>Admin</MobileNavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" currentPath={location.pathname} onClick={closeMenus}>Login</MobileNavLink>
                <MobileNavLink to="/register" currentPath={location.pathname} onClick={closeMenus}>Register</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  currentPath: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, currentPath, children }) => {
  const isActive = currentPath.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'text-primary-500 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
      }`}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, currentPath, onClick, children }) => {
  const isActive = currentPath.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? 'text-primary-500 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-300'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;