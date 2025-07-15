import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../ui/card';
import Spinner from '../ui/Spinner';
import Button from '../ui/button';
import { Input } from '../ui/Input';

interface Crypto {
  _id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  minChangePct: number;
  maxChangePct: number;
  adminFluctuationEnabled: boolean;
  direction?: 'up' | 'down' | 'random'; // Add direction field
}

const AdminCryptoSettings: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cryptos');
      setCryptos(res.data);
    } catch (err: any) {
      setError('Failed to load cryptos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id: string, field: keyof Crypto, value: any) => {
    setCryptos(cryptos => cryptos.map(c => c._id === id ? { ...c, [field]: value } : c));
  };

  const handleDirection = async (id: string, direction: 'up' | 'down' | 'random') => {
    // Optimistically update UI
    setCryptos(cryptos => cryptos.map(c => c._id === id ? { ...c, direction } : c));
    try {
      await api.put(`/api/cryptos/${id}`, { direction });
      // Optionally, refetch cryptos to sync
      // await fetchCryptos();
    } catch (err) {
      // Optionally, show error and revert UI
      setError('Failed to update direction');
      setCryptos(cryptos => cryptos.map(c => c._id === id ? { ...c, direction: 'random' } : c));
    }
  };

  const handleSave = async (crypto: Crypto) => {
    setSavingId(crypto._id);
    setError(null);
    try {
      await api.put(`/api/cryptos/${crypto._id}`, {
        currentPrice: crypto.currentPrice,
        minPrice: crypto.minPrice,
        maxPrice: crypto.maxPrice,
        minChangePct: crypto.minChangePct,
        maxChangePct: crypto.maxChangePct,
        adminFluctuationEnabled: crypto.adminFluctuationEnabled
      });
      await fetchCryptos();
    } catch (err: any) {
      setError('Failed to save changes');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      <Card title="Crypto Settings">
        {error && <div className="text-danger-500 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-300">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Current Price</th>
                <th className="px-4 py-2">Min Price</th>
                <th className="px-4 py-2">Max Price</th>
                <th className="px-4 py-2">Min %</th>
                <th className="px-4 py-2">Max %</th>
                <th className="px-4 py-2">Fluctuation</th>
                <th className="px-4 py-2">Direction</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
              {cryptos.map(crypto => (
                <tr key={crypto._id}>
                  <td className="px-4 py-2"><img src={crypto.image} alt={crypto.symbol} className="w-8 h-8" /></td>
                  <td className="px-4 py-2">{crypto.name}</td>
                  <td className="px-4 py-2">{crypto.symbol}</td>
                  <td className="px-4 py-2">
                    <Input type="number" value={crypto.currentPrice} onChange={e => handleChange(crypto._id, 'currentPrice', parseFloat(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <Input type="number" value={crypto.minPrice} onChange={e => handleChange(crypto._id, 'minPrice', parseFloat(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <Input type="number" value={crypto.maxPrice} onChange={e => handleChange(crypto._id, 'maxPrice', parseFloat(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <Input type="number" value={crypto.minChangePct} onChange={e => handleChange(crypto._id, 'minChangePct', parseFloat(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <Input type="number" value={crypto.maxChangePct} onChange={e => handleChange(crypto._id, 'maxChangePct', parseFloat(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="checkbox" checked={crypto.adminFluctuationEnabled} onChange={e => handleChange(crypto._id, 'adminFluctuationEnabled', e.target.checked)} />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleDirection(crypto._id, 'up')}>Up</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDirection(crypto._id, 'down')}>Down</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDirection(crypto._id, 'random')}>Reset</Button>
                    </div>
                    <div className="text-xs mt-1 text-gray-500">{crypto.direction ? crypto.direction.toUpperCase() : 'RANDOM'}</div>
                  </td>
                  <td className="px-4 py-2">
                    <Button size="sm" variant="primary" onClick={() => handleSave(crypto)} disabled={savingId === crypto._id}>
                      {savingId === crypto._id ? 'Saving...' : 'Save'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminCryptoSettings; 