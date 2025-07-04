import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, AlertCircle } from 'lucide-react';
import { withdraw } from '../../redux/thunks/walletThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { isValidWithdrawalAmount, validatePaymentDetails } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import Input from '../ui/Input';
import { Button } from '../ui/button';
import Alert from '../ui/Alert';

const WithdrawalForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, loading, error } = useSelector((state: RootState) => state.wallet);
  
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('bank_transfer');
  const [paymentDetails, setPaymentDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    walletAddress: '',
    network: '',
    email: ''
  });
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
  
  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet) {
      setFormError('Wallet not found');
      return;
    }
    
    if (!amount || !isValidWithdrawalAmount(amount, wallet.balance)) {
      setFormError('Please enter a valid amount');
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    if (amountValue < 10) {
      setFormError('Minimum withdrawal amount is $10');
      return;
    }
    
    if (!validatePaymentDetails(paymentMethod, paymentDetails)) {
      setFormError('Please fill in all payment details');
      return;
    }
    
    const result = await dispatch(withdraw({
      amount: amountValue,
      paymentMethod,
      paymentDetails
    }));
    
    if (withdraw.fulfilled.match(result)) {
      setAmount('');
      setSuccess(true);
    }
  };
  
  const renderPaymentDetailsFields = () => {
    switch (paymentMethod) {
      case 'bank_transfer':
        return (
          <>
            <Input
              label="Account Name"
              type="text"
              name="accountName"
              id="accountName"
              value={paymentDetails.accountName}
              onChange={handlePaymentDetailsChange}
              placeholder="Enter account name"
              required
            />
            
            <Input
              label="Account Number"
              type="text"
              name="accountNumber"
              id="accountNumber"
              value={paymentDetails.accountNumber}
              onChange={handlePaymentDetailsChange}
              placeholder="Enter account number"
              required
            />
            
            <Input
              label="Bank Name"
              type="text"
              name="bankName"
              id="bankName"
              value={paymentDetails.bankName}
              onChange={handlePaymentDetailsChange}
              placeholder="Enter bank name"
              required
            />
          </>
        );
      
      case 'crypto':
        return (
          <>
            <Input
              label="Wallet Address"
              type="text"
              name="walletAddress"
              id="walletAddress"
              value={paymentDetails.walletAddress}
              onChange={handlePaymentDetailsChange}
              placeholder="Enter wallet address"
              required
            />
            
            <Input
              label="Network"
              type="text"
              name="network"
              id="network"
              value={paymentDetails.network}
              onChange={handlePaymentDetailsChange}
              placeholder="Enter network (e.g., BTC, ETH, BNB)"
              required
            />
          </>
        );
      
      case 'paypal':
        return (
          <Input
            label="PayPal Email"
            type="email"
            name="email"
            id="email"
            value={paymentDetails.email}
            onChange={handlePaymentDetailsChange}
            placeholder="Enter PayPal email"
            required
          />
        );
      
      default:
        return null;
    }
  };
  
  if (success) {
    return (
      <div>
        <Alert
          variant="success"
          title="Withdrawal Request Submitted"
          message="Your withdrawal request has been submitted successfully. It will be processed within 1-3 business days."
          className="mb-6"
        />
        
        <Button
          variant="default"
          onClick={() => {
            setSuccess(false);
            setAmount('');
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Make Another Withdrawal
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdraw Funds</h3>
      
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
            label="Withdrawal Amount (USD)"
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
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Minimum withdrawal: $10
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Available balance: {formatCurrency(wallet?.balance || 0)}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Withdrawal Method
          </label>
          
          <div className="space-y-2">
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
            
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                id="paypal"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="paypal" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                PayPal
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Payment Details
          </h4>
          
          {renderPaymentDetailsFields()}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-warning-500 mr-2" />
            <h4 className="text-base font-medium text-gray-900 dark:text-white">Important Notice</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Withdrawal requests are processed within 1-3 business days. A confirmation email will be sent once your request is approved.
          </p>
        </div>
        
        <Button
          type="submit"
          variant="default"
          disabled={!amount || !isValidWithdrawalAmount(amount, wallet?.balance || 0) || parseFloat(amount) < 10 || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Request Withdrawal'}
        </Button>
      </form>
    </div>
  );
};

export default WithdrawalForm;