import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/thunks/authThunks';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import Sidebar from '../components/common/Sidebar';
import { RootState, AppDispatch } from '../redux/store';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [success, setSuccess] = useState<string>('');
  
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear success message
    if (success) {
      setSuccess('');
    }
  };
  
  const validateForm = () => {
    const errors = {
      name: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (formData.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return !errors.name && !errors.currentPassword && !errors.newPassword && !errors.confirmPassword;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updateData: {
        name: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        name: formData.name
      };
      
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      const result = await dispatch(updateProfile(updateData));
      
      if (updateProfile.fulfilled.match(result)) {
        setSuccess('Profile updated successfully');
        
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    }
  };
  
  return (
    <div className="flex min-h-screen bg-light-200 dark:bg-dark-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:hidden mb-6">
            <button 
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 focus:outline-none"
              onClick={toggleSidebar}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="sr-only">Open sidebar</span>
            </button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and security.
            </p>
          </div>
          
          <Card>
            {success && (
              <Alert
                variant="success"
                message={success}
                className="mb-6"
              />
            )}
            
            {error && (
              <Alert
                variant="danger"
                message={error}
                className="mb-6"
              />
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={formErrors.name}
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>
                  
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      error={formErrors.currentPassword}
                    />
                    
                    <Input
                      label="New Password"
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      error={formErrors.newPassword}
                    />
                    
                    <Input
                      label="Confirm New Password"
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={formErrors.confirmPassword}
                    />
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Leave password fields empty if you don't want to change your password.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                                      <Button
                      type="submit"
                      variant="default"
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;