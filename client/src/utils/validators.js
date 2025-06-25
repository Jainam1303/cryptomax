// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 6 characters, containing at least one number and one letter
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// Validate name
export const isValidName = (name) => {
  return name.trim().length >= 2;
};

// Validate amount
export const isValidAmount = (amount) => {
  const amountValue = parseFloat(amount);
  return !isNaN(amountValue) && amountValue > 0;
};

// Validate withdrawal amount
export const isValidWithdrawalAmount = (amount, balance) => {
  const amountValue = parseFloat(amount);
  return !isNaN(amountValue) && amountValue > 0 && amountValue <= balance;
};

// Validate payment details
export const validatePaymentDetails = (paymentMethod, details) => {
  switch (paymentMethod) {
    case 'bank_transfer':
      return details.accountName && details.accountNumber && details.bankName;
    case 'crypto':
      return details.walletAddress && details.network;
    case 'paypal':
      return isValidEmail(details.email);
    default:
      return false;
  }
};