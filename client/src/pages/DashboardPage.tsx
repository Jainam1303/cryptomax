import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";

const DashboardPage = () => {
  const portfolioData = {
    totalValue: 125750.42,
    dayChange: 2847.23,
    dayChangePercent: 2.31,
    totalInvested: 120000,
    totalProfit: 5750.42,
    profitPercent: 4.79
  };

  const holdings = [
    { name: "Bitcoin", symbol: "BTC", amount: 2.5, value: 108750, allocation: 86.4, change: 2.45, positive: true },
    { name: "Ethereum", symbol: "ETH", amount: 7.2, value: 12500, allocation: 9.9, change: 1.23, positive: true },
    { name: "Solana", symbol: "SOL", amount: 45.8, value: 3200, allocation: 2.5, change: -0.87, positive: false },
    { name: "Cardano", symbol: "ADA", amount: 2800, value: 1300.42, allocation: 1.0, change: 3.21, positive: true }
  ];

  const recentTransactions = [
    { type: "buy", asset: "BTC", amount: 0.5, value: 21625, time: "2 hours ago" },
    { type: "sell", asset: "ETH", amount: 1.2, value: 2856, time: "1 day ago" },
    { type: "buy", asset: "SOL", amount: 15.0, value: 1477.5, time: "2 days ago" },
    { type: "deposit", asset: "USD", amount: 5000, value: 5000, time: "3 days ago" }
  ];

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
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Invest Now
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your portfolio overview.</p>
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
                ${portfolioData.totalValue.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm mt-1 ${portfolioData.dayChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.dayChange > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                ${Math.abs(portfolioData.dayChange).toLocaleString()} ({portfolioData.dayChangePercent}%)
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Profit</CardTitle>
              <PieChart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${portfolioData.totalProfit.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {portfolioData.profitPercent}% gain
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Excellent</div>
              <p className="text-xs text-gray-600 mt-1">Above market average</p>
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
                {holdings.map((holding, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{holding.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{holding.name}</div>
                        <div className="text-sm text-gray-500">{holding.amount} {holding.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${holding.value.toLocaleString()}</div>
                      <div className="flex items-center space-x-2">
                        <Badge className={holding.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {holding.positive ? '+' : ''}{holding.change}%
                        </Badge>
                        <span className="text-sm text-gray-500">{holding.allocation}%</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'buy' ? 'bg-green-100' :
                        transaction.type === 'sell' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {transaction.type === 'buy' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                         transaction.type === 'sell' ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                         <Wallet className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">
                          {transaction.type} {transaction.asset}
                        </div>
                        <div className="text-sm text-gray-500">{transaction.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {transaction.type === 'sell' ? '-' : ''}${transaction.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.amount} {transaction.asset}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
