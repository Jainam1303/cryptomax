import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Plus, LogOut, Search, CreditCard, BarChart2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useInvestment } from '../context/InvestmentContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { wallet, transactions, getWallet, getTransactions } = useWallet();
  const { portfolio, investments, getPortfolio, getInvestments } = useInvestment();

  useEffect(() => {
    // Load data when component mounts
    getWallet();
    getPortfolio();
    getInvestments();
    getTransactions();
  }, []);

  // Fallback data for when API data is not available
  const portfolioData = portfolio?.summary || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0
  };

  const holdings = investments || [];
  const recentTransactions = transactions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CryptoMax
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Link to="/crypto">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Invest Now
                </Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's your portfolio overview.</p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/wallet">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Wallet</h3>
                <p className="text-sm text-gray-600">Deposit & Withdraw</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/crypto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Explore Crypto</h3>
                <p className="text-sm text-gray-600">Search & Invest</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/portfolio">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart2 className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Portfolio</h3>
                <p className="text-sm text-gray-600">Track Performance</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/transactions">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Transactions</h3>
                <p className="text-sm text-gray-600">View History</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Portfolio</CardTitle>
              <Wallet className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${portfolioData.totalCurrentValue.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm mt-1 ${portfolioData.totalProfitLoss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.totalProfitLoss > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                ${Math.abs(portfolioData.totalProfitLoss).toLocaleString()} ({portfolioData.totalProfitLossPercentage.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Invested</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${portfolioData.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Initial investment</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Profit/Loss</CardTitle>
              <PieChart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.totalProfitLoss >= 0 ? '+' : ''}${portfolioData.totalProfitLoss.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm mt-1 ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.totalProfitLoss >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {portfolioData.totalProfitLossPercentage.toFixed(2)}% {portfolioData.totalProfitLoss >= 0 ? 'gain' : 'loss'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Wallet Balance</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${wallet?.balance?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Available balance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Holdings */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Holdings
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
              <CardDescription>Your current cryptocurrency positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.length > 0 ? (
                  holdings.map((investment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{investment.crypto.symbol[0]}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{investment.crypto.name}</div>
                          <div className="text-sm text-gray-500">{investment.quantity} {investment.crypto.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${investment.currentValue.toLocaleString()}</div>
                        <div className="flex items-center space-x-2">
                          <Badge className={investment.profitLoss >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {investment.profitLoss >= 0 ? '+' : ''}{investment.profitLossPercentage.toFixed(2)}%
                          </Badge>
                          <span className="text-sm text-gray-500">{investment.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No investments yet. Start investing to see your holdings here!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activity
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
              <CardDescription>Your latest transactions and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'investment' ? 'bg-green-100' :
                          transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {transaction.type === 'investment' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                           transaction.type === 'withdrawal' ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                           <Wallet className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 capitalize">
                            {transaction.type} {transaction.currency}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent transactions. Your transaction history will appear here!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
