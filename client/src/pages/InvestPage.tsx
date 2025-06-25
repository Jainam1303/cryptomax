import React, { useState } from 'react';
import CryptoList from '../components/invest/CryptoList';
import Sidebar from '../components/common/Sidebar';

const InvestPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-light-200 dark:bg-dark-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:hidden mb-6">
            <button 
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 focus:outline-none"
              onClick={toggleSidebar}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="sr-only">Open sidebar</span>
            </button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cryptocurrency Market
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore cryptocurrencies and invest in your favorites.
            </p>
          </div>
          
          <CryptoList />
        </div>
      </div>
    </div>
  );
};

export default InvestPage;