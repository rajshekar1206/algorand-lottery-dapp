# Backend Setup Instructions

## Quick Start

The frontend is currently running but needs the backend server to be started for full functionality.

### Option 1: Using Neon (Recommended - Cloud Database)

1. **Connect to Neon Database** (Recommended)
   - Click [Connect to Neon](#open-mcp-popover) in the Builder.io interface
   - This will provide a managed PostgreSQL database

2. **Start the Backend**
   ```bash
   cd backend
   npm install
   npm run migrate  # Run database migrations
   npm run dev      # Start the backend server
   ```

### Option 2: Local PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # On macOS (with Homebrew)
   brew install postgresql
   
   # On Windows - Download from https://postgresql.org
   ```

2. **Create Database**
   ```bash
   sudo -u postgres createdb lottery_db
   ```

3. **Update Database Configuration**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env file and update DATABASE_URL with your PostgreSQL credentials
   ```

4. **Start the Backend**
   ```bash
   npm install
   npm run migrate  # Run database migrations
   npm run dev      # Start the backend server
   ```

### Option 3: Docker Setup (Alternative)

1. **Using Docker Compose**
   ```bash
   # Create docker-compose.yml in project root
   docker-compose up -d postgres
   cd backend
   npm run migrate
   npm run dev
   ```

## Verification

Once the backend is running:

1. The frontend should show "Backend server connected" status
2. You can access the API at: http://localhost:3001/api
3. You can register/login and purchase lottery tickets

## Troubleshooting

### Common Issues

1. **Port 3001 already in use**
   ```bash
   # Find and kill process using port 3001
   lsof -ti:3001 | xargs kill -9
   ```

2. **Database connection error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in backend/.env
   - Verify database exists and credentials are correct

3. **Permission errors**
   - Ensure you have write permissions in the project directory
   - On Linux/macOS, you might need to use `sudo` for some operations

### Environment Variables

Ensure your `backend/.env` file contains:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@localhost:5432/lottery_db
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
TICKET_PRICE=5.00
DRAW_FREQUENCY=daily
MAX_TICKETS_PER_USER=10
```

## Demo Credentials

Once the backend is running, you can use these demo credentials:

- **Admin Login**: admin@lottery.com / admin123
- **Create your own user**: Use the registration page

## Features Available

With the backend running, you'll have access to:

- ✅ User registration and authentication
- ✅ Lottery ticket purchasing (6 numbers from 1-50)
- ✅ Quick pick number generation
- ✅ Draw management (admin)
- ✅ Results viewing
- ✅ User ticket history
- ✅ Admin dashboard
- ✅ Statistics and analytics

## Need Help?

- Check the connection status indicator on the home page
- Review the browser console for detailed error messages
- Ensure both frontend (port 5173) and backend (port 3001) are running
