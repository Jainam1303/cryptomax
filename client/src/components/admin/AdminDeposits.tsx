import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getDashboardData } from '../../redux/thunks/adminThunks';
import Card from '../ui/card';
import Spinner from '../ui/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminDeposits: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardData, loading, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  // Assume dashboardData.recentTransactions contains all transactions
  const depositTransactions = dashboardData?.recentTransactions?.filter((tx: any) => tx.type === 'deposit') || [];

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

  return (
    <div className="space-y-6">
      <Card title="User Deposits">
        {depositTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No deposit transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
                {depositTransactions.map((tx: any) => (
                  <tr key={tx._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {typeof tx.user === 'object' ? tx.user.name : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {typeof tx.user === 'object' ? tx.user.email : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(tx.createdAt, true)}
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

export default AdminDeposits; 