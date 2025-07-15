import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Search, TrendingUp, TrendingDown, DollarSign, Loader2, Plus } from "lucide-react";
import { useCrypto } from '../context/CryptoContext';
import { useInvestment } from '../context/InvestmentContext';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { io as socketIOClient } from 'socket.io-client';
import api from '../services/api';

// Define a local Crypto type for this file
interface Crypto {
  _id: string;
  name: string;
  symbol: string;
  image?: string;
  currentPrice: number;
  minPrice?: number;
  maxPrice?: number;
  minChangePct?: number;
  maxChangePct?: number;
  adminFluctuationEnabled?: boolean;
  marketCap?: number;
  volume24h?: number;
  circulatingSupply?: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
  isActive?: boolean;
  direction?: 'up' | 'down' | 'random';
}

const CryptoPage = () => {
  const { cryptos, filteredCryptos, loading, searchQuery, setSearchQuery, getCryptos } = useCrypto();
  const { buyInvestment, loading: investmentLoading } = useInvestment();
  const { wallet, getWallet } = useWallet();
  const { user, logout } = useAuth();
  
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [tickerCryptos, setTickerCryptos] = useState<Crypto[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [socket, setSocket] = useState<any>(null);

  // Initial fetch for cryptos on mount
  useEffect(() => {
    async function fetchInitialCryptos() {
      try {
        const res = await api.get('/api/cryptos');
        setTickerCryptos(res.data);
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchInitialCryptos();
  }, []);

  // Connect to socket.io and listen for updates
  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000');
    setSocket(socket);
    socket.on('cryptos:update', (updatedCryptos: Crypto[]) => {
      setTickerCryptos(updatedCryptos);
      setLastUpdated(new Date());
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleBuyInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrypto) return;
    
    try {
      await buyInvestment(selectedCrypto._id, Number(investmentAmount));
      setInvestmentAmount('');
      setIsBuyDialogOpen(false);
      setSelectedCrypto(null);
      await getWallet(); // Refresh wallet balance
    } catch (error) {
      // Error handled in context
    }
  };

  const openBuyDialog = (crypto: any) => {
    setSelectedCrypto(crypto);
    setIsBuyDialogOpen(true);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cryptocurrencies</h1>
          <p className="text-gray-600">Discover and invest in cryptocurrencies.</p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Available Balance</h3>
                <p className="text-3xl font-bold text-green-600">
                  ${wallet?.balance?.toLocaleString() || '0.00'}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </Card>

        {/* Search */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Crypto List */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Available Cryptocurrencies</h2>
            <p className="text-gray-600 mb-4">Click on any cryptocurrency to invest</p>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {tickerCryptos.length > 0 ? (
                  tickerCryptos.filter(crypto =>
                    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((crypto) => (
                    <div
                      key={crypto._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer"
                      onClick={() => openBuyDialog(crypto)}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Show crypto image */}
                        {crypto.image ? (
                          <img src={crypto.image} alt={crypto.symbol} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{crypto.symbol[0]}</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{crypto.name}</div>
                          <div className="text-sm text-gray-500">{crypto.symbol}</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          ${crypto.currentPrice.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={
                              crypto.priceChangePercentage24h >= 0 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {crypto.priceChangePercentage24h >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {crypto.priceChangePercentage24h >= 0 ? '+' : ''}
                            {crypto.priceChangePercentage24h.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 text-right">Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : ''}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Market Cap</div>
                        <div className="font-semibold text-gray-900">
                          ${crypto.marketCap.toLocaleString()}
                        </div>
                      </div>
                      <Button size="sm" className="ml-4">
                        <Plus className="w-4 h-4 mr-1" />
                        Invest
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {searchQuery ? 'No cryptocurrencies found matching your search.' : 'No cryptocurrencies available.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Buy Investment Dialog */}
        <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Invest in {selectedCrypto?.name}
              </DialogTitle>
              <DialogDescription>
                Current price: ${selectedCrypto?.currentPrice?.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBuyInvestment} className="space-y-4">
              <div>
                <Label htmlFor="investment-amount">Investment Amount (USD)</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={wallet?.balance || 0}
                  placeholder="Enter amount to invest"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: ${wallet?.balance?.toLocaleString() || '0.00'}
                </p>
                {investmentAmount && selectedCrypto && (
                  <p className="text-xs text-gray-600 mt-1">
                    You will receive approximately {(Number(investmentAmount) / selectedCrypto.currentPrice).toFixed(6)} {selectedCrypto.symbol}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={investmentLoading} className="w-full">
                {investmentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Investment...
                  </>
                ) : (
                  `Invest $${investmentAmount || '0'}`
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CryptoPage;