import React, { useState } from 'react';
import Wallet from '../components/wallet/Wallet';
import TransactionHistory from '../components/wallet/TransactionHistory';
import Sidebar from '../components/common/Sidebar';

const WalletPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Wallet</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your funds, make deposits and withdrawals, and track all your transactions.
          </p>
        </div>
        
        <div className="space-y-8">
          <Wallet />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;