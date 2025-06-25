import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { login } from '../../redux/thunks/authThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { isValidEmail } from '../../utils/validators';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return !errors.email && !errors.password;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const resultAction = await dispatch(login(formData));
      if (login.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sign in to your account to continue
        </p>
      </div>
      
      <Card>
        {error && (
          <Alert
            variant="danger"
            message={error}
            className="mb-4"
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={formErrors.email}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={formErrors.password}
            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
          >
            Sign in
          </Button>
        </form>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;