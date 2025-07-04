import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Users, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CryptoMax
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The most advanced cryptocurrency investment platform. Trade, invest, and grow your portfolio with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-2xl hover:shadow-purple-500/25"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-2xl hover:shadow-purple-500/25"
                  >
                    <span>Start Trading</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose CryptoMax?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of cryptocurrency trading with our cutting-edge platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Advanced Analytics"
              description="Real-time market data, technical indicators, and comprehensive portfolio analytics to make informed decisions."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Bank-Level Security"
              description="Industry-leading security measures including 2FA, cold storage, and insurance protection for your assets."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Ultra-fast order execution and instant deposits/withdrawals. Never miss a trading opportunity again."
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Portfolio Management"
              description="Advanced portfolio tracking, rebalancing tools, and performance analytics to optimize your investments."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="24/7 Support"
              description="Round-the-clock customer support from our team of crypto experts. We're here when you need us."
              gradient="from-indigo-500 to-blue-500"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8" />}
              title="Award Winning"
              description="Recognized as the #1 crypto platform for innovation, security, and user experience."
              gradient="from-red-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Millions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard number="2M+" label="Active Users" />
            <StatCard number="$50B+" label="Trading Volume" />
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="150+" label="Cryptocurrencies" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Crypto Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join millions of users who trust CryptoMax for their cryptocurrency investments
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 inline-flex items-center space-x-2 shadow-2xl hover:shadow-purple-500/25"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient }) => {
  return (
    <div className="group bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-black/60 transition-all duration-300 hover:scale-105">
      <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">{number}</div>
      <div className="text-gray-300 text-lg">{label}</div>
    </div>
  );
};

export default HomePage;