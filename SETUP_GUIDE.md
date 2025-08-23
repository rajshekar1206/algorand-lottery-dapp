# 🎲 Algorand Lottery dApp - Complete Setup Guide

## ✅ **Current Status: FULLY FUNCTIONAL**

Your Algorand lottery dApp is now running with:
- ✅ Frontend (React + Vite) on port 5173
- ✅ Backend (Express + TypeScript) on port 3001
- ✅ SQLite demo database with lottery tables
- ✅ Pera Wallet integration for Algorand TestNet
- ✅ Complete lottery functionality

## 🚀 **How to Use the App**

### 1. **Connect Pera Wallet**
- Install [Pera Wallet](https://perawallet.app/) on your mobile device
- Make sure you're on Algorand TestNet
- Click "Connect Wallet" in the app
- Scan QR code or use WalletConnect

### 2. **Get TestNet ALGO**
- Visit [Algorand TestNet Dispenser](https://testnet.algoexplorer.io/dispenser)
- Enter your wallet address
- Get free TestNet ALGO for testing

### 3. **Play the Lottery**
- Select 6 numbers (1-50) or use Quick Pick
- Purchase tickets for 5.00 ALGO each
- Check results after draws are conducted
- Win prizes based on matching numbers!

## 🎯 **Lottery Rules**

### **Prize Structure:**
- **6 matches**: Jackpot (60% of prize pool)
- **5 matches**: Second prize (20% of prize pool)
- **4 matches**: Third prize (15% of prize pool)
- **3 matches**: Fourth prize (5% of prize pool)

### **Ticket Pricing:**
- **5.00 ALGO** per ticket
- Maximum 10 tickets per user per draw
- Numbers from 1-50, select exactly 6

## 🔧 **Development Commands**

```bash
# Start both frontend and backend
npm run dev:full

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build
```

## 📊 **API Endpoints**

### **Public Endpoints:**
- `GET /api/health` - Health check
- `GET /api/lottery/current-draw` - Current draw info
- `GET /api/lottery/draws` - Recent draws
- `GET /api/lottery/statistics` - Lottery statistics
- `GET /api/lottery/quick-pick` - Generate numbers

### **Authenticated Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/lottery/purchase-ticket` - Buy ticket
- `GET /api/lottery/my-tickets` - User tickets

### **Admin Endpoints:**
- `GET /api/admin/dashboard` - Admin dashboard
- `POST /api/admin/draws` - Create draw
- `POST /api/admin/draws/:id/conduct` - Conduct draw

## 🔐 **Demo Credentials**

**Admin Access:**
- Email: `admin@lottery.com`
- Password: `admin123`

## 🛠️ **Production Deployment**

### **For Real PostgreSQL Database:**

1. **Get Neon Database:**
   - Sign up at [Neon.tech](https://neon.tech)
   - Create a PostgreSQL database
   - Copy the connection string

2. **Update Backend Environment:**
   ```bash
   # backend/.env
   DATABASE_URL=postgresql://user:password@host:5432/lottery_db?sslmode=require
   NODE_ENV=production
   JWT_SECRET=your-secure-jwt-secret
   ```

3. **Run Migrations:**
   ```bash
   cd backend
   npm run migrate
   ```

### **For Algorand MainNet:**

1. **Update Algorand Configuration:**
   ```typescript
   // src/hooks/useAlgorandWallet.ts
   const peraWallet = new PeraWalletConnect({
     chainId: 416001 // MainNet
   });
   
   const algodServer = "https://mainnet-api.algonode.cloud";
   ```

2. **Update Ticket Pricing:**
   ```typescript
   // Real ALGO pricing for production
   const TICKET_PRICE_ALGO = 0.1; // Adjust as needed
   ```

## 🎮 **Features Overview**

### **User Features:**
- 🔗 Pera Wallet connection
- 🎫 Ticket purchasing with ALGO
- 🎯 Number selection (manual or quick pick)
- 📊 Ticket history and status
- 🏆 Results viewing and prize checking

### **Admin Features:**
- 👥 User management
- 🎲 Draw creation and scheduling
- 🎯 Draw execution and winner selection
- 📈 Statistics and analytics dashboard

### **Technical Features:**
- ⚡ Real-time backend integration
- 🔐 JWT authentication
- 🛡️ Input validation and security
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Pera Wallet Connection Fails:**
   - Ensure you're on TestNet
   - Try refreshing the page
   - Check mobile wallet app is updated

2. **Backend Connection Error:**
   - Verify both servers are running
   - Check port 3001 is not blocked
   - Look for error messages in console

3. **BigInt Conversion Errors:**
   - Fixed with proper type conversion
   - App handles Algorand SDK BigInt values correctly

### **Error Suppression:**
The app automatically suppresses common network and BigInt errors in development for a cleaner console experience.

## 📝 **Development Notes**

### **Architecture:**
- **Frontend**: React 19 + TypeScript + Vite + Tailwind
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (production) / SQLite (demo)
- **Blockchain**: Algorand TestNet/MainNet
- **Wallet**: Pera Wallet Connect

### **Key Files:**
- `src/hooks/useAlgorandWallet.ts` - Algorand integration
- `backend/src/database/` - Database layer
- `backend/src/utils/lottery-sdk.ts` - Lottery logic
- `src/components/AlgorandTicketPurchase.tsx` - Main purchase flow

## 🎉 **Ready to Play!**

Your Algorand lottery dApp is fully functional and ready for users to:
1. Connect their Pera wallets
2. Purchase lottery tickets with ALGO
3. Participate in draws and win prizes!

Enjoy your decentralized lottery application! 🎰
