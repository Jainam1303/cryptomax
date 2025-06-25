import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, DollarSign } from 'lucide-react';
import { deposit } from '../../redux/thunks/walletThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { isValidAmount } from '../../utils/validators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const DepositForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.wallet);
  
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [formError, setFormError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setFormError('');
    setSuccess(false);
  };
  
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !isValidAmount(amount)) {
      setFormError('Please enter a valid amount');
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    if (amountValue < 10) {
      setFormError('Minimum deposit amount is $10');
      return;
    }
    
    const result = await dispatch(deposit({
      amount: amountValue,
      paymentMethod
    }));
    
    if (deposit.fulfilled.match(result)) {
      setAmount('');
      setSuccess(true);
    }
  };
  
  if (success) {
    return (
      <div>
        <Alert
          variant="success"
          title="Deposit Successful"
          message="Your deposit has been processed successfully. The funds have been added to your wallet."
          className="mb-6"
        />
        
        <Button
          variant="primary"
          onClick={() => {
            setSuccess(false);
            setAmount('');
          }}
        >
          Make Another Deposit
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deposit Funds</h3>
      
      {error && (
        <Alert
          variant="danger"
          message={error}
          className="mb-4"
        />
      )}
      
      {formError && (
        <Alert
          variant="danger"
          message={formError}
          className="mb-4"
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            label="Deposit Amount (USD)"
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            leftIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
            min="10"
            step="0.01"
            required
          />
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Minimum deposit amount: $10
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Method
          </label>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                id="credit_card"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="credit_card" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Credit/Debit Card
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                id="bank_transfer"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="bank_transfer" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Bank Transfer
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                id="crypto"
                value="crypto"
                checked={paymentMethod === 'crypto'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="crypto" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Cryptocurrency
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <CreditCard className="h-5 w-5 text-primary-500 mr-2" />
            <h4 className="text-base font-medium text-gray-900 dark:text-white">Payment Information</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a demo application. No actual payment will be processed. In a real application, you would be redirected to a secure payment gateway.
          </p>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={!amount || !isValidAmount(amount) || parseFloat(amount) < 10}
        >
          Deposit Funds
        </Button>
      </form>
    </div>
  );
};

export default DepositForm;