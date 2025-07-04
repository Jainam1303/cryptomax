import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { getDashboardData } from '../../redux/thunks/adminThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import Spinner from '../ui/Spinner';
import { Transaction } from '../../types';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardData, loading, error } = useSelector((state: RootState) => state.admin);
  
  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-500">{error}</p>
      </div>
    );
  }
  
  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Dashboard data not available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData.userCount}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/30 text-success-500 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(dashboardData.financials.totalDeposits)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-500 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(dashboardData.financials.totalWithdrawals)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-500 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData.financials.pendingWithdrawals}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 mr-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Overview</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Investments:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {dashboardData.financials.activeInvestments}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Investment Amount:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(dashboardData.financials.totalInvestmentAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Investment:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(
                  dashboardData.financials.activeInvestments > 0
                    ? dashboardData.financials.totalInvestmentAmount / dashboardData.financials.activeInvestments
                    : 0
                )}
              </span>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-info-100 dark:bg-info-900/30 text-info-500 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Summary</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Revenue:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(dashboardData.financials.totalDeposits)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Payouts:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(dashboardData.financials.totalWithdrawals)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Net Balance:</span>
              <span className="font-medium text-success-500">
                {formatCurrency(dashboardData.financials.totalDeposits - dashboardData.financials.totalWithdrawals)}
              </span>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Recent Transactions">
        {dashboardData.recentTransactions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No recent transactions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.recentTransactions.map((transaction: Transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {typeof transaction.user === 'object' ? transaction.user.name : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.type === 'deposit' || transaction.type === 'profit'
                          ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                          : transaction.type === 'withdrawal' || transaction.type === 'loss'
                          ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300'
                          : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                          : transaction.status === 'pending'
                          ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                          : 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;