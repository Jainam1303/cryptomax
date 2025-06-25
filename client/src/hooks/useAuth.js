import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../redux/thunks/authThunks';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, user]);
  
  return { isAuthenticated, user, loading, error };
};

export default useAuth;