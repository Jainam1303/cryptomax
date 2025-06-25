import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock } from 'lucide-react';
import { register } from '../../redux/thunks/authThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { isValidEmail, isStrongPassword } from '../../utils/validators';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isStrongPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters with at least one letter and one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { name, email, password } = formData;
      const resultAction = await dispatch(register({ name, email, password }));
      if (register.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sign up to start investing in cryptocurrencies
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
            label="Full name"
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={formErrors.name}
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
            required
          />
          
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
          
          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={formErrors.confirmPassword}
            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-primary-500 hover:text-primary-600">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-500 hover:text-primary-600">
                Privacy Policy
              </Link>
            </p>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
          >
            Create account
          </Button>
        </form>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;