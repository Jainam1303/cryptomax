import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Wallet,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { RootState, AppDispatch } from '../redux/store';
import { getWallet } from '../redux/thunks/walletThunks';
import { getPortfolio } from '../redux/thunks/investmentThunks';
import { getCryptos } from '../redux/thunks/cryptoThunks';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet } = useSelector((state: RootState) => state.wallet);
  const { portfolio } = useSelector((state: RootState) => state.investment);
  const { cryptos } = useSelector((state: RootState) => state.crypto);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    dispatch(getWallet());
    dispatch(getPortfolio());
    dispatch(getCryptos());
  }, [dispatch]);

  // Mock data for demonstration - replace with real data from your store
  const cryptoData = portfolio?.investments?.map((investment: any) => ({
    name: investment.crypto.name,
    symbol: investment.crypto.symbol,
    price: investment.crypto.currentPrice,
    change: investment.profitLossPercentage,
    amount: investment.quantity,
    value: investment.currentValue,
    color: getColorForCrypto(investment.crypto.symbol)
  })) || [
    { name: "Bitcoin", symbol: "BTC", price: 43250.0, change: 5.2, amount: 0.5, value: 21625.0, color: "bg-orange-500" },
    { name: "Ethereum", symbol: "ETH", price: 2650.0, change: 3.8, amount: 8.2, value: 21730.0, color: "bg-blue-500" },
    { name: "Cardano", symbol: "ADA", price: 0.45, change: -2.1, amount: 15000, value: 6750.0, color: "bg-green-500" },
    { name: "Solana", symbol: "SOL", price: 98.5, change: 7.3, amount: 45, value: 4432.5, color: "bg-purple-500" },
    { name: "Polygon", symbol: "MATIC", price: 0.85, change: -1.5, amount: 5000, value: 4250.0, color: "bg-indigo-500" },
  ];

  const totalValue = portfolio?.summary?.totalCurrentValue || cryptoData.reduce((sum: number, crypto: any) => sum + crypto.value, 0);
  const totalChange = portfolio?.summary?.totalProfitLossPercentage || 5.2;
  const totalChangeAmount = portfolio?.summary?.totalProfitLoss || 2847;

  function getColorForCrypto(symbol: string): string {
    const colors: { [key: string]: string } = {
      BTC: "bg-orange-500",
      ETH: "bg-blue-500",
      ADA: "bg-green-500",
      SOL: "bg-purple-500",
      MATIC: "bg-indigo-500",
      BNB: "bg-yellow-500",
    };
    return colors[symbol] || "bg-gray-500";
  }

  const bestPerformer = cryptoData.reduce((best: any, crypto: any) => 
    crypto.change > best.change ? crypto : best, cryptoData[0] || { change: 0, symbol: "N/A" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">CryptoMax</h1>
            <div className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
              Dashboard
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search cryptocurrencies..."
                className="w-64 pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-sm">
          <nav className="p-6">
            <ul className="space-y-2">
              <li>
                <button className="w-full flex items-center justify-start px-4 py-2 text-white bg-white/10 rounded-lg">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Overview
                </button>
              </li>
              <li>
                <Link to="/portfolio" className="w-full flex items-center justify-start px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                  <Wallet className="mr-3 h-4 w-4" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/invest" className="w-full flex items-center justify-start px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                  <PieChart className="mr-3 h-4 w-4" />
                  Invest
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="w-full flex items-center justify-start px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                  <TrendingUp className="mr-3 h-4 w-4" />
                  Wallet
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Portfolio Summary */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Portfolio Overview</h2>
                <p className="text-gray-300">Track your cryptocurrency investments</p>
              </div>
              <Link to="/invest" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/40 border border-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-sm font-medium text-gray-300 mb-2">Total Value</div>
                <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
                <div className={`flex items-center text-sm ${totalChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(totalChange).toFixed(2)}%
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-sm font-medium text-gray-300 mb-2">24h Change</div>
                <div className="text-2xl font-bold text-green-400">
                  {totalChangeAmount >= 0 ? '+' : ''}${Math.abs(totalChangeAmount).toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-green-400">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {Math.abs(totalChange).toFixed(1)}%
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-sm font-medium text-gray-300 mb-2">Best Performer</div>
                <div className="text-2xl font-bold text-white">{bestPerformer.symbol}</div>
                <div className="flex items-center text-sm text-green-400">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {bestPerformer.change.toFixed(1)}%
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-sm font-medium text-gray-300 mb-2">Assets</div>
                <div className="text-2xl font-bold text-white">{cryptoData.length}</div>
                <div className="text-sm text-gray-400">Cryptocurrencies</div>
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="bg-black/40 border border-white/10 backdrop-blur-sm rounded-lg">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Your Holdings</h3>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {cryptoData.map((crypto: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full ${crypto.color} flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{crypto.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-sm text-gray-400">{crypto.symbol}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-white">${crypto.price.toLocaleString()}</div>
                      <div className={`text-sm ${crypto.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {crypto.change >= 0 ? "+" : ""}
                        {crypto.change.toFixed(1)}%
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-white">{crypto.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">{crypto.symbol}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-white">${crypto.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">{((crypto.value / totalValue) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
                
                {cryptoData.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">No investments found</div>
                    <Link to="/invest" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg inline-flex items-center transition-colors">
                      <Plus className="mr-2 h-4 w-4" />
                      Start Investing
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;