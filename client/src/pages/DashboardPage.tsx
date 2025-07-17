import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Plus, LogOut, Search, CreditCard, BarChart2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useInvestment } from '../context/InvestmentContext';
import { useDispatch, useSelector } from 'react-redux';
import { getWallet, getTransactions } from '../redux/thunks/walletThunks';
import { getPortfolio, getInvestments } from '../redux/thunks/investmentThunks';
import { getCryptos, getMarketData } from '../redux/thunks/cryptoThunks';
import { useCrypto } from '../context/CryptoContext';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const wallet = useSelector((state: any) => state.wallet.wallet);
  const transactions = useSelector((state: any) => state.wallet.transactions);
  const portfolio = useSelector((state: any) => state.investment.portfolio);
  const investments = useSelector((state: any) => state.investment.investments);
  const { tickerCryptos } = useCrypto();

  useEffect(() => {
    (dispatch as any)(getWallet());
    (dispatch as any)(getTransactions());
    (dispatch as any)(getPortfolio());
    (dispatch as any)(getInvestments());
    (dispatch as any)(getCryptos());
    (dispatch as any)(getMarketData());
  }, [dispatch]);

  // Helper to get live price for a crypto
  const getLivePrice = (cryptoId: string, fallback: number) => {
    const ticker = tickerCryptos.find(c => c._id === cryptoId);
    return ticker ? ticker.currentPrice : fallback;
  };
  // Helper to get admin-set price for a crypto
  const getAdminPrice = (cryptoId: string, fallback: number) => {
    const ticker = tickerCryptos.find(c => c._id === cryptoId);
    return ticker && (ticker as any).minPrice ? (ticker as any).minPrice : fallback;
  };
  // Live portfolio summary
  let totalInvested = 0;
  let totalCurrentValue = 0;
  let totalProfitLoss = 0;
  let totalProfitLossPercentage = 0;
  if (investments && investments.length > 0) {
    investments.forEach(investment => {
      const livePrice = getLivePrice(investment.crypto._id, investment.crypto.currentPrice) ?? 0;
      const currentValue = investment.quantity * livePrice;
      totalInvested += investment.amount ?? 0;
      totalCurrentValue += currentValue;
      totalProfitLoss += currentValue - (investment.amount ?? 0);
    });
    totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  }
  const livePortfolioData = {
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercentage
  };

  const recentTransactions = transactions || [];

  // Add loading and zero-value guards
  const investmentsLoading = !investments || typeof investments === 'undefined';
  if (investmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading portfolio...</div>
      </div>
    );
  }
  const zeroInvestments = investments.filter(inv => inv.amount === 0 || inv.quantity === 0);
  if (zeroInvestments.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Data Warning</h2>
          <p>Some investments have zero amount or quantity. Please contact support or check backend data integrity.</p>
        </div>
      </div>
    );
  }

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
              <div className="p-6 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Wallet</h3>
                <p className="text-sm text-gray-600">Deposit & Withdraw</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/crypto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6 text-center">
                <Search className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Explore Crypto</h3>
                <p className="text-sm text-gray-600">Search & Invest</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/portfolio">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6 text-center">
                <BarChart2 className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Portfolio</h3>
                <p className="text-sm text-gray-600">Track Performance</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/transactions">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold text-gray-900 mb-1">Transactions</h3>
                <p className="text-sm text-gray-600">View History</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Total Portfolio</span>
              <Wallet className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-gray-900">
                ${livePortfolioData.totalCurrentValue.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm mt-1 ${livePortfolioData.totalProfitLoss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {livePortfolioData.totalProfitLoss > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                ${Math.abs(livePortfolioData.totalProfitLoss).toLocaleString()} ({livePortfolioData.totalProfitLossPercentage.toFixed(2)}%)
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Total Invested</span>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-gray-900">
                ${livePortfolioData.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Initial investment</p>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Total Profit/Loss</span>
              <PieChart className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className={`text-2xl font-bold ${livePortfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{livePortfolioData.totalProfitLoss >= 0 ? '+' : ''}${livePortfolioData.totalProfitLoss.toLocaleString()}</div>
              <div className={`flex items-center text-sm mt-1 ${livePortfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {livePortfolioData.totalProfitLoss >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {livePortfolioData.totalProfitLossPercentage.toFixed(2)}% {livePortfolioData.totalProfitLoss >= 0 ? 'gain' : 'loss'}
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Wallet Balance</span>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-blue-600">
                ${wallet?.balance?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Available balance</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Holdings */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="flex items-center font-semibold text-lg">Your Holdings</span>
              <Link to="/portfolio">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {investments.length > 0 ? (
                  investments.map((investment, index) => {
                    const invLivePrice = getLivePrice(investment.crypto._id, investment.crypto.currentPrice) ?? 0;
                    const invQuantity = investment.quantity ?? 0;
                    const invAmount = investment.amount ?? 0;
                    const invCurrentValue = invQuantity * invLivePrice;
                    const invProfitLoss = invCurrentValue - invAmount;
                    const invProfitLossPercentage = invAmount !== 0 ? (invProfitLoss / invAmount) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          {investment.crypto.image ? (
                            <img
                              src={investment.crypto.image}
                              alt={investment.crypto.symbol}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : investment.crypto.symbol === 'BTC' ? (
                            <img
                              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                              alt="Bitcoin"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">{investment.crypto.symbol[0]}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{investment.crypto.name}</div>
                            <div className="text-sm text-gray-500">{invQuantity} {investment.crypto.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${invProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>${(invCurrentValue ?? 0).toLocaleString()}</div>
                          <div className="flex items-center space-x-2">
                            <Badge className={invProfitLoss >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {invProfitLoss >= 0 ? '+' : ''}{(invProfitLossPercentage ?? 0).toFixed(2)}%
                            </Badge>
                            <span className="text-sm text-gray-500">{investment.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No investments yet. Start investing to see your holdings here!</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="flex items-center font-semibold text-lg">Recent Activity</span>
              <Link to="/transactions">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="px-6 pb-6">
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
                          ${(transaction.amount ?? 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent activity yet.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
