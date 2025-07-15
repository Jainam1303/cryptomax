import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Minus, Loader2, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useInvestment } from '../context/InvestmentContext';
import { useAuth } from '../context/AuthContext';
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCrypto } from '../context/CryptoContext';

const PortfolioPage: React.FC = () => {
  const { investments, portfolio, loading, getPortfolio, getInvestments, sellInvestment } = useInvestment();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'performance'>('overview');
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const { tickerCryptos } = useCrypto();

  useEffect(() => {
    getPortfolio();
    getInvestments();
  }, []);

  const handleSellInvestment = async () => {
    if (!selectedInvestment) return;
    try {
      const livePrice = getLivePrice(selectedInvestment.crypto._id, selectedInvestment.crypto.currentPrice);
      await sellInvestment(selectedInvestment._id, livePrice);
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

  // Warning for zero amount or quantity
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

  // Helper to get live price for a crypto
  const getLivePrice = (cryptoId: string, fallback: number) => {
    const ticker = tickerCryptos.find(c => c._id === cryptoId);
    return ticker ? ticker.currentPrice : fallback;
  };

  // Live portfolio summary
  let totalInvested = 0;
  let totalCurrentValue = 0;
  let totalProfitLoss = 0;
  let totalProfitLossPercentage = 0;
  if (investments && investments.length > 0) {
    investments.forEach(investment => {
      const livePrice = getLivePrice(investment.crypto._id, investment.crypto.currentPrice);
      const currentValue = investment.quantity * livePrice;
      totalInvested += investment.amount;
      totalCurrentValue += currentValue;
      totalProfitLoss += currentValue - investment.amount;
    });
    totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  }
  const livePortfolioData = {
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercentage
  };

  const isProfitable = livePortfolioData.totalProfitLoss >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
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
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Total Invested</div>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${livePortfolioData.totalInvested.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">Initial investment</p>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Current Value</div>
              <PieChart className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${livePortfolioData.totalCurrentValue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">Market value</p>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Total P&L</div>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className={`text-2xl font-bold ${livePortfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{livePortfolioData.totalProfitLoss >= 0 ? '+' : ''}${livePortfolioData.totalProfitLoss.toLocaleString()}</div>
            <div className={`flex items-center text-sm mt-1 ${livePortfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{livePortfolioData.totalProfitLoss >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}{livePortfolioData.totalProfitLossPercentage.toFixed(2)}%</div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Holdings</div>
              <PieChart className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {investments?.length || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Active positions</p>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900">
              Your Holdings
            </div>
            <Link to="/crypto">
              <Button variant="outline" size="sm">Invest More</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {investments && investments.length > 0 ? (
                  investments.map((investment) => {
                    const livePrice = getLivePrice(investment.crypto._id, investment.crypto.currentPrice);
                    const currentValue = (investment.quantity ?? 0) * (livePrice ?? 0);
                    const profitLoss = currentValue - (investment.amount ?? 0);
                    const profitLossPercentage = (investment.amount ?? 0) !== 0 ? (profitLoss / investment.amount) * 100 : 0;
                    return (
                      <div key={investment._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{investment.crypto.symbol[0]}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{investment.crypto.name}</div>
                            <div className="text-sm text-gray-500">
                              {(investment.quantity ?? 0).toFixed(6)} {investment.crypto.symbol}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Invested</div>
                          <div className="font-semibold text-gray-900">${investment.amount.toLocaleString()}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Current Value</div>
                          <div className={`font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>${currentValue.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Live: ${(livePrice ?? 0).toLocaleString()}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">P&L</div>
                          <div className={`font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString()}</div>
                          <div className="flex items-center justify-center space-x-2">
                            <Badge className={profitLoss >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {profitLoss >= 0 ? '+' : ''}{(profitLossPercentage ?? 0).toFixed(2)}%
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
                    );
                  })
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
              </>
            )}
          </div>
        </Card>

        {/* Sell Investment Dialog */}
        <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Sell {selectedInvestment?.crypto?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedInvestment && (() => {
              const livePrice = getLivePrice(selectedInvestment.crypto._id, selectedInvestment.crypto.currentPrice) ?? 0;
              const quantity = selectedInvestment.quantity ?? 0;
              const amount = selectedInvestment.amount ?? 0;
              const currentValue = quantity * livePrice;
              const profitLoss = currentValue - amount;
              return (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Holdings:</span>
                      <span className="font-semibold">
                        {(quantity).toFixed(6)} {selectedInvestment.crypto.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Value:</span>
                      <span className="font-semibold">${(currentValue ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit/Loss:</span>
                      <span className={`font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profitLoss >= 0 ? '+' : ''}${(profitLoss ?? 0).toLocaleString()}</span>
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
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PortfolioPage;