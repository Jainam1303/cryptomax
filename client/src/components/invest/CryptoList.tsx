import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getCryptos } from '../../redux/thunks/cryptoThunks';
import { RootState, AppDispatch } from '../../redux/store';
import CryptoCard from './CryptoCard';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';

const CryptoList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cryptos, loading, error } = useSelector((state: RootState) => state.crypto);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(getCryptos());
  }, [dispatch]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredCryptos = cryptos?.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCryptoClick = (id: string) => {
    navigate(`/crypto/${id}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={handleSearch}
          leftIcon={<Search className="h-5 w-5 text-gray-400" />}
        />
      </div>
      
      {filteredCryptos?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No cryptocurrencies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCryptos?.map(crypto => (
            <CryptoCard
              key={crypto._id}
              crypto={crypto}
              onClick={() => handleCryptoClick(crypto._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoList;