import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Minus, Loader2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useInvestment } from '../context/InvestmentContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PortfolioPage: React.FC = () => {
  const { investments, portfolio, loading, getPortfolio, getInvestments, sellInvestment } = useInvestment();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'performance'>('overview');
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  useEffect(() => {
    getPortfolio();
    getInvestments();
  }, [getPortfolio, getInvestments]);

  const handleSellInvestment = async () => {
    if (!selectedInvestment) return;
    
    try {
      await sellInvestment(selectedInvestment._id);
      setIsSellDialogOpen(false);
      setSelectedInvestment(null);
    } catch (error) {
      // Error handled in context
    }
  };

  const openSellDialog = (investment: any) => {
    setSelectedInvestment(investment);
    setIsSellDialogOpen(true);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <span className="mr-2 font-bold">←</span>
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CM</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CryptoMax
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">Track your investment performance and manage your holdings.</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${portfolio?.summary?.totalInvested?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Initial investment</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Value</CardTitle>
              <PieChart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${portfolio?.summary?.totalCurrentValue?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Market value</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total P&L</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (portfolio?.summary?.totalProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(portfolio?.summary?.totalProfitLoss || 0) >= 0 ? '+' : ''}
                ${portfolio?.summary?.totalProfitLoss?.toLocaleString() || '0.00'}
              </div>
              <div className={`flex items-center text-sm mt-1 ${
                (portfolio?.summary?.totalProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(portfolio?.summary?.totalProfitLoss || 0) >= 0 ? 
                  <TrendingUp className="w-3 h-3 mr-1" /> : 
                  <TrendingDown className="w-3 h-3 mr-1" />
                }
                {portfolio?.summary?.totalProfitLossPercentage?.toFixed(2) || '0.00'}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Holdings</CardTitle>
              <PieChart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {investments?.length || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">Active positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Holdings
              <Link to="/crypto">
                <Button variant="outline" size="sm">Invest More</Button>
              </Link>
            </CardTitle>
            <CardDescription>Your current cryptocurrency positions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {investments && investments.length > 0 ? (
                  investments.map((investment) => (
                    <div key={investment._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{investment.crypto.symbol[0]}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{investment.crypto.name}</div>
                          <div className="text-sm text-gray-500">
                            {investment.quantity.toFixed(6)} {investment.crypto.symbol}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Invested</div>
                        <div className="font-semibold text-gray-900">${investment.amount.toLocaleString()}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Current Value</div>
                        <div className="font-semibold text-gray-900">${investment.currentValue.toLocaleString()}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-500">P&L</div>
                        <div className={`font-semibold ${
                          investment.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {investment.profitLoss >= 0 ? '+' : ''}${investment.profitLoss.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Badge className={
                            investment.profitLoss >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }>
                            {investment.profitLoss >= 0 ? '+' : ''}{investment.profitLossPercentage.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-2">Status</div>
                        <Badge className="bg-blue-100 text-blue-700 mb-2">
                          {investment.status}
                        </Badge>
                        <div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                            onClick={() => openSellDialog(investment)}
                          >
                            <Minus className="w-3 h-3 mr-1" />
                            Sell
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No investments yet. Start building your portfolio!</p>
                    <Link to="/crypto">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        Start Investing
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sell Investment Dialog */}
        <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Sell {selectedInvestment?.crypto?.name}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to sell your entire position?
              </DialogDescription>
            </DialogHeader>
            {selectedInvestment && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Holdings:</span>
                    <span className="font-semibold">
                      {selectedInvestment.quantity.toFixed(6)} {selectedInvestment.crypto.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-semibold">${selectedInvestment.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit/Loss:</span>
                    <span className={`font-semibold ${
                      selectedInvestment.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedInvestment.profitLoss >= 0 ? '+' : ''}${selectedInvestment.profitLoss.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSellDialogOpen(false)} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSellInvestment} 
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Selling...
                      </>
                    ) : (
                      'Confirm Sale'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PortfolioPage;