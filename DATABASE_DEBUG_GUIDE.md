# 🔍 Database Debug Guide

## 🚨 **Issue**: Pending Deposits Not Appearing

The admin panel shows "No pending deposits" because the database isn't connected or deposits aren't being saved.

## 🔧 **Debug Steps:**

### **Step 1: Check Database Status**
Visit this URL in your browser:
```
http://localhost:5000/api/database-status
```

**Expected Response if Database Connected:**
```json
{
  "success": true,
  "database": {
    "readyState": 1,
    "connected": true,
    "host": "localhost",
    "port": 27017,
    "name": "cryptomax"
  },
  "stats": {
    "totalTransactions": 0,
    "pendingDeposits": 0
  }
}
```

**If Database Not Connected:**
```json
{
  "success": false,
  "database": {
    "readyState": 0,
    "connected": false
  },
  "error": "Database not connected"
}
```

### **Step 2: Fix Database Connection**

#### **Option A: Install MongoDB Locally**
1. **Download MongoDB** from https://www.mongodb.com/try/download/community
2. **Install and start MongoDB service**
3. **Restart your server**

#### **Option B: Use MongoDB Atlas (Free Cloud)**
1. **Go to** https://www.mongodb.com/atlas
2. **Create free account**
3. **Create a cluster**
4. **Get connection string** and set environment variable:
   ```bash
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cryptomax
   ```

#### **Option C: Use Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **Step 3: Test Deposit Flow**

1. **Start server** and check console for:
   ```
   ✅ MongoDB Connected Successfully!
   ```

2. **Make a test deposit**:
   - Go to wallet page
   - Enter amount: $100
   - Enter TXID: test-123
   - Submit deposit

3. **Check server console** for:
   ```
   💰 Deposit request received: { amount: 100, paymentMethod: "credit_card", txid: "test-123" }
   ✅ Deposit transaction saved to database: [transaction-id]
   ```

4. **Check admin panel**:
   - Set admin role in browser console
   - Go to admin → Deposits
   - Should show the pending deposit

### **Step 4: Verify Database Collections**

If database is connected, you should see these collections:
- `users` - User accounts
- `wallets` - User wallet balances  
- `transactions` - All deposits/withdrawals
- `withdrawalrequests` - Withdrawal requests

### **🔍 Troubleshooting:**

**If you see "Database not connected":**
1. **Install MongoDB** locally or use Atlas
2. **Check if MongoDB service is running**
3. **Verify connection string** in environment variables
4. **Check firewall/network** if using remote database

**If deposits aren't saving:**
1. **Check server console** for error messages
2. **Verify database connection** using the status endpoint
3. **Check if Transaction model** is properly defined

**If admin panel shows "No pending deposits":**
1. **Check if deposits are actually being saved** (server console logs)
2. **Verify database query** is correct
3. **Check if user authentication** is working properly

## ✅ **Expected Result:**

After fixing the database connection:
- ✅ Server shows "MongoDB Connected Successfully!"
- ✅ Deposits are saved to database
- ✅ Admin panel shows pending deposits
- ✅ Approve/Reject buttons work
- ✅ User wallet balance updates on approval 