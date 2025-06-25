import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvestments, adjustInvestment } from '../../redux/thunks/adminThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';

const ProfitLossSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { investments, loading, error } = useSelector((state: RootState) => state.admin);
  
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [adjustmentEnabled, setAdjustmentEnabled] = useState<boolean>(false);
  const [adjustmentPercentage, setAdjustmentPercentage] = useState<string>('0');
  
  useEffect(() => {
    dispatch(getInvestments());
  }, [dispatch]);
  
  const handleAdjust = (id: string, enabled: boolean, percentage: number) => {
    setSelectedInvestment(id);
    setAdjustmentEnabled(enabled);
    setAdjustmentPercentage(percentage.toString());
    setIsModalOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!selectedInvestment) return;
    
    await dispatch(adjustInvestment({
      id: selectedInvestment,
      enabled: adjustmentEnabled,
      percentage: parseFloat(adjustmentPercentage)
    }));
    
    setIsModalOpen(false);
    setSelectedInvestment(null);
  };
  
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
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profit/Loss Adjustments</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Adjust the displayed profit/loss percentage for user investments. This does not affect the actual value of the investments, only how they appear to users.
          </p>
        </div>
        
        <Alert
          variant="warning"
          title="Important Notice"
          message="These adjustments are for demonstration purposes only. In a production environment, manipulating profit/loss displays would be unethical and potentially illegal."
          className="mb-6"
        />
        
        {investments?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No active investments found</p>
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
                    Cryptocurrency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profit/Loss
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Adjustment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
                {investments?.map((investment) => (
                  <tr key={investment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {typeof investment.user === 'object' ? investment.user.name : 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {typeof investment.user === 'object' ? investment.user.email : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {investment.crypto.image ? (
                          <img
                            src={investment.crypto.image}
                            alt={investment.crypto.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2">
                            <span className="text-primary-500 text-xs font-bold">{investment.crypto.symbol.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {investment.crypto.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {investment.crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(investment.amount)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {investment.quantity.toFixed(8)} {investment.crypto.symbol}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(investment.currentValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        investment.profitLoss >= 0 ? 'text-success-500' : 'text-danger-500'
                      }`}>
                        {formatCurrency(investment.profitLoss)} ({formatPercentage(investment.profitLossPercentage)})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {investment.adminAdjustment?.enabled ? (
                        <div className="text-sm text-warning-500">
                          {investment.adminAdjustment.percentage > 0 ? '+' : ''}
                          {formatPercentage(investment.adminAdjustment.percentage)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          None
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAdjust(
                          investment._id,
                          investment.adminAdjustment?.enabled || false,
                          investment.adminAdjustment?.percentage || 0
                        )}
                      >
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Profit/Loss Display"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="adjustmentEnabled"
              checked={adjustmentEnabled}
              onChange={(e) => setAdjustmentEnabled(e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="adjustmentEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable profit/loss adjustment
            </label>
          </div>
          
          <Input
            label="Adjustment Percentage"
            type="number"
            name="adjustmentPercentage"
            id="adjustmentPercentage"
            value={adjustmentPercentage}
            onChange={(e) => setAdjustmentPercentage(e.target.value)}
            placeholder="Enter percentage (e.g., 10 for +10%, -10 for -10%)"
            disabled={!adjustmentEnabled}
          />
          
          <Alert
            variant="info"
            message="Positive values will increase the displayed profit (or decrease the displayed loss). Negative values will decrease the displayed profit (or increase the displayed loss)."
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProfitLossSettings;