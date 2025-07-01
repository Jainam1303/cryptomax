import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, ArrowUpRight, ArrowDownRight, Plus, Eye, BarChart3 } from 'lucide-react';
import { RootState, AppDispatch } from '../redux/store';
import { getPortfolio, getInvestments } from '../redux/thunks/investmentThunks';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PortfolioPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { portfolio, investments, loading } = useSelector((state: RootState) => state.investment);
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'performance'>('overview');

  useEffect(() => {
    dispatch(getPortfolio());
    dispatch(getInvestments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const summary = portfolio?.summary || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0
  };

  const isProfitable = summary.totalProfitLoss >= 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Investment Portfolio
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Track your crypto investments, monitor performance, and make informed decisions with real-time data.
        </p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Value */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio Value</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(summary.totalCurrentValue)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invested: {formatCurrency(summary.totalInvested)}
            </p>
          </div>
        </div>

        {/* Profit/Loss */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isProfitable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {isProfitable ? (
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">P&L</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(Math.abs(summary.totalProfitLoss))}
            </p>
            <p className={`text-sm font-semibold ${isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isProfitable ? '+' : ''}{formatPercentage(summary.totalProfitLossPercentage)}
            </p>
          </div>
        </div>

        {/* Total Holdings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Holdings</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {investments?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active investments
            </p>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isProfitable ? 'Profitable' : 'Loss'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overall trend
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'holdings', label: 'Holdings', icon: PieChart },
              { id: 'performance', label: 'Performance', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {investments && investments.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Investments
                  </h3>
                  {investments.slice(0, 5).map((investment) => {
                    const isProfit = investment.profitLoss >= 0;
                    return (
                      <div key={investment._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            {investment.crypto.image ? (
                              <img src={investment.crypto.image} alt={investment.crypto.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                                {investment.crypto.symbol.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {investment.crypto.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {investment.quantity.toFixed(6)} {investment.crypto.symbol}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(investment.currentValue)}
                          </p>
                          <div className={`flex items-center space-x-1 ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {isProfit ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">
                              {formatPercentage(investment.profitLossPercentage)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PieChart className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Investments Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Start building your crypto portfolio by making your first investment.
                  </p>
                  <Link
                    to="/invest"
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Start Investing</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'holdings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                All Holdings
              </h3>
              {investments && investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((investment) => {
                    const isProfit = investment.profitLoss >= 0;
                    return (
                      <div key={investment._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              {investment.crypto.image ? (
                                <img src={investment.crypto.image} alt={investment.crypto.name} className="w-12 h-12 rounded-full" />
                              ) : (
                                <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
                                  {investment.crypto.symbol.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {investment.crypto.name}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {investment.crypto.symbol}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(investment.currentValue)}
                            </p>
                            <div className={`flex items-center justify-end space-x-1 ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isProfit ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                              <span className="font-medium">
                                {formatCurrency(Math.abs(investment.profitLoss))} ({formatPercentage(investment.profitLossPercentage)})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Quantity</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {investment.quantity.toFixed(6)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Buy Price</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(investment.buyPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Current Price</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(investment.crypto.currentPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Invested</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(investment.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No holdings to display</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Portfolio Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Invested</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(summary.totalInvested)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Value</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(summary.totalCurrentValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total P&L</span>
                      <span className={`font-semibold ${isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(summary.totalProfitLoss)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">P&L Percentage</span>
                      <span className={`font-semibold ${isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatPercentage(summary.totalProfitLossPercentage)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <Link
                      to="/invest"
                      className="flex items-center space-x-3 w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Make New Investment</span>
                    </Link>
                    <Link
                      to="/crypto/bitcoin"
                      className="flex items-center space-x-3 w-full p-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                      <span>View Crypto Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;