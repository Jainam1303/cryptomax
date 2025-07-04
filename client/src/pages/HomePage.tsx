import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Wallet, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Maximize Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Crypto{" "}
              </span>
              Potential
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced cryptocurrency tracking, portfolio management, and investment insights. Take control of your
              digital assets with professional-grade tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                  >
                    View Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/invest"
                    className="border border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                  >
                    Start Trading
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                  >
                    Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="border border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-pulse">
            <div className="bg-black/40 border border-purple-500/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₿</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Bitcoin</p>
                  <p className="text-green-400 text-xs">+5.2%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-40 right-10 animate-pulse" style={{ animationDelay: '1000ms' }}>
            <div className="bg-black/40 border border-blue-500/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Ξ</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Ethereum</p>
                  <p className="text-green-400 text-xs">+3.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features for Crypto Traders</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to track, analyze, and optimize your cryptocurrency investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-white" />}
              title="Real-time Analytics"
              description="Advanced charts and analytics to track your portfolio performance in real-time"
              iconBg="bg-purple-600"
            />

            <FeatureCard
              icon={<Wallet className="h-6 w-6 text-white" />}
              title="Portfolio Management"
              description="Comprehensive portfolio tracking with detailed insights and performance metrics"
              iconBg="bg-blue-600"
            />

            <FeatureCard
              icon={<TrendingUp className="h-6 w-6 text-white" />}
              title="Smart Alerts"
              description="Get notified about price movements, market trends, and investment opportunities"
              iconBg="bg-green-600"
            />

            <FeatureCard
              icon={<Shield className="h-6 w-6 text-white" />}
              title="Secure Trading"
              description="Bank-level security with encrypted transactions and secure wallet integration"
              iconBg="bg-orange-600"
            />

            <FeatureCard
              icon={<Zap className="h-6 w-6 text-white" />}
              title="Lightning Fast"
              description="Execute trades in milliseconds with our optimized trading engine"
              iconBg="bg-red-600"
            />

            <FeatureCard
              icon={<Users className="h-6 w-6 text-white" />}
              title="Community Insights"
              description="Learn from experienced traders and share insights with the community"
              iconBg="bg-pink-600"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">$2.5B+</div>
              <div className="text-gray-300">Total Volume Traded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">150K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Supported Coins</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Maximize Your Crypto Portfolio?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of traders who trust CryptoMax for their cryptocurrency investments
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
            >
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">CryptoMax</h3>
              <p className="text-gray-300 text-sm">
                The ultimate platform for cryptocurrency trading and portfolio management.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/invest" className="hover:text-white transition-colors">
                    Invest
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-white transition-colors">
                    Portfolio
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; 2024 CryptoMax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, iconBg }) => {
  return (
    <div className="bg-black/40 border border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors rounded-lg p-6">
      <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default HomePage;