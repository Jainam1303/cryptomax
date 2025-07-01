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
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium">🚀 Your crypto journey starts here</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Invest in <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Crypto</span><br />
                with Confidence
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
                Build your cryptocurrency portfolio with our secure, intuitive platform.
                Track real-time performance and make data-driven investment decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="text-lg px-8 py-4 rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
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
                        className="text-lg px-8 py-4 rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        Start Investing Now
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-2 border-white/50 backdrop-blur-sm text-white text-lg px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1024"
                alt="Cryptocurrency"
                className="w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 relative z-10"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CryptoMax</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of cryptocurrency investing with our cutting-edge platform built for modern investors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl inline-block mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Bank-Grade Security
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your investments are protected with military-grade encryption and multi-factor authentication.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl inline-block mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Advanced charts, portfolio tracking, and AI-powered insights to maximize your returns.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl inline-block mb-6">
                <Wallet className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Instant Transactions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Lightning-fast deposits and withdrawals with multiple payment methods and low fees.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl inline-block mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                24/7 Expert Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Round-the-clock assistance from crypto experts whenever you need guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to Start Your<br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Crypto Journey?</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of smart investors who trust CryptoMax for their cryptocurrency investments.
            Start building your wealth today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button
                variant="secondary"
                size="lg"
                className="text-lg px-10 py-4 rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Investing Now'}
              </Button>
            </Link>
            {!isAuthenticated && (
              <div className="text-center">
                <p className="text-sm text-white/70 mb-2">Already have an account?</p>
                <Link to="/login" className="text-white hover:text-yellow-300 font-semibold underline transition-colors">
                  Sign in here
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;