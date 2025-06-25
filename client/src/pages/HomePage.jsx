import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Shield, TrendingUp, Wallet, Users } from 'lucide-react';
import { RootState } from '../redux/store';
import Button from '../components/ui/Button';
import Footer from '../components/common/Footer';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return (
    <div className="bg-light-200 dark:bg-dark-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Invest in Cryptocurrencies with Confidence
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Start your investment journey today with our secure and user-friendly platform.
                Monitor your portfolio in real-time and make informed decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button
                      variant="secondary"
                      size="lg"
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button
                        variant="secondary"
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-white text-white hover:bg-white/10"
                      >
                        Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1024"
                alt="Cryptocurrency"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We provide a secure, intuitive, and feature-rich platform for cryptocurrency investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-md">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full inline-block mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Platform
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your investments are protected with industry-leading security measures and encryption.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-md">
              <div className="p-3 bg-success-100 dark:bg-success-900/30 text-success-500 rounded-full inline-block mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your investments with advanced analytics and real-time performance metrics.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-md">
              <div className="p-3 bg-warning-100 dark:bg-warning-900/30 text-warning-500 rounded-full inline-block mb-4">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Easy Deposits & Withdrawals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your funds with our simple and intuitive wallet system. Multiple payment options available.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-md">
              <div className="p-3 bg-info-100 dark:bg-info-900/30 text-info-500 rounded-full inline-block mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Dedicated Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team is available 24/7 to assist you with any questions or concerns you may have.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Investing?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust our platform for their cryptocurrency investments.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button
              variant="secondary"
              size="lg"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Create Account'}
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;