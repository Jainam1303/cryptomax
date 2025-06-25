import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle } from 'lucide-react';
import { getTransactions } from '../../redux/thunks/walletThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';

const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: RootState) => state.wallet);
  
  useEffect(() => {
    dispatch(getTransactions());
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
  
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your transaction history will appear here once you make deposits, withdrawals, or investments.
          </p>
        </div>
      </Card>
    );
  }
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-5 w-5 text-success-500" />;
      case 'withdrawal':
        return <ArrowDownRight className="h-5 w-5 text-danger-500" />;
      case 'investment':
        return <TrendingUp className="h-5 w-5 text-primary-500" />;
      case 'profit':
        return <TrendingUp className="h-5 w-5 text-success-500" />;
      case 'loss':
        return <TrendingUp className="h-5 w-5 text-danger-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-warning-500" />;
    }
  };
  
  const getTransactionText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'investment':
        return 'Investment';
      case 'profit':
        return 'Profit from investment';
      case 'loss':
        return 'Loss from investment';
      case 'referral':
        return 'Referral bonus';
      default:
        return type;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  return (
    <Card title="Transaction History">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-dark-300">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transaction
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTransactionText(transaction.type)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.reference}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDate(transaction.createdAt, true)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(transaction.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionHistory;