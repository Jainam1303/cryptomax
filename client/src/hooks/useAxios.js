import { useState, useEffect } from 'react';
import api from '../services/api';

const useAxios = (url, method = 'GET', payload = null, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  
  const refetch = () => setRefetchIndex(prevIndex => prevIndex + 1);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        switch (method.toUpperCase()) {
          case 'GET':
            response = await api.get(url);
            break;
          case 'POST':
            response = await api.post(url, payload);
            break;
          case 'PUT':
            response = await api.put(url, payload);
            break;
          case 'DELETE':
            response = await api.delete(url);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (url) {
      fetchData();
    }
  }, [url, method, payload, refetchIndex]);
  
  return { data, loading, error, refetch };
};

export default useAxios;