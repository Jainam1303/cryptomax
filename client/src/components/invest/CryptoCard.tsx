import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../ui/Card';
import { Crypto } from '../../types';

interface CryptoCardProps {
  crypto: Crypto;
  onClick: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onClick }) => {
  const isPriceUp = crypto.priceChangePercentage24h >= 0;
  
  return (
    <Card
      hoverable
      onClick={onClick}
      className="transition-transform hover:translate-y-[-4px]"
    >
      <div className="flex items-center mb-4">
        {crypto.image ? (
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
            <span className="text-primary-500 font-bold">{crypto.symbol.charAt(0)}</span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{crypto.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.symbol}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(crypto.currentPrice)}
          </p>
        </div>
        
        <div className="flex items-center">
          {isPriceUp ? (
            <TrendingUp className="h-5 w-5 text-success-500 mr-1" />
          ) : (
            <TrendingDown className="h-5 w-5 text-danger-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${
            isPriceUp ? 'text-success-500' : 'text-danger-500'
          }`}>
            {formatPercentage(crypto.priceChangePercentage24h)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Market Cap</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(crypto.marketCap, true)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">24h Volume</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(crypto.volume24h, true)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CryptoCard;