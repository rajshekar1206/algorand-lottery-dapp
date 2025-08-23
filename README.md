# Lottery Web Application

A complete full-stack lottery web application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## 🎯 Features

### User Features
- **User Registration & Authentication** - JWT-based secure authentication
- **Lottery Ticket Purchase** - Buy tickets with number selection or quick pick
- **Dashboard** - View purchased tickets and track draws
- **Results Page** - View recent draws and winning numbers
- **Responsive Design** - Works on desktop, tablet, and mobile

### Admin Features
- **Admin Panel** - Complete administration dashboard
- **Draw Management** - Schedule and conduct lottery draws
- **User Management** - View and manage all users
- **Statistics** - Comprehensive lottery statistics and analytics

### Security Features
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive validation using Zod
- **Rate Limiting** - API rate limiting for security
- **SQL Injection Protection** - Parameterized queries
- **CORS Protection** - Secure cross-origin requests

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **PostgreSQL** database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lottery-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   ```

3. **Set up the database**
   - Create a PostgreSQL database
   - Copy environment variables:
     ```bash
     cd backend
     cp .env.example .env
     ```
   - Update the `DATABASE_URL` in `backend/.env`

4. **Run database migrations**
   ```bash
   cd backend
   npm run migrate
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🔧 Configuration

### Backend Environment Variables
Create `backend/.env` with:
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lottery_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Lottery Settings
TICKET_PRICE=5.00
DRAW_FREQUENCY=daily
MAX_TICKETS_PER_USER=10
```

### Frontend Environment Variables
Create `.env` with:
```env
VITE_API_URL=http://localhost:3001/api
```

## 📱 Usage

### For Users
1. **Register** - Create an account on the registration page
2. **Login** - Sign in to access your dashboard
3. **Buy Tickets** - Select numbers or use quick pick to purchase tickets
4. **View Results** - Check recent draws and winning numbers
5. **Track Tickets** - View your purchased tickets and win status

### For Administrators
1. **Login** with admin credentials (admin@lottery.com / admin123)
2. **Access Admin Panel** - Navigate to /admin
3. **Manage Draws** - Schedule new draws and conduct existing ones
4. **View Statistics** - Monitor system performance and user activity
5. **User Management** - View and manage all registered users

## 🎮 Game Rules

- **Numbers**: Select 6 numbers from 1-50
- **Ticket Price**: $5.00 per ticket
- **Win Conditions**:
  - 6 matches: Jackpot (60% of prize pool)
  - 5 matches: Second prize (20% of prize pool)
  - 4 matches: Third prize (15% of prize pool)
  - 3 matches: Fourth prize (5% of prize pool)

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Comprehensive validation on all endpoints
- **Rate Limiting**: Protection against abuse
- **CORS**: Secure cross-origin requests
- **SQL Injection Protection**: Parameterized queries

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Lottery
- `GET /api/lottery/current-draw` - Get current draw
- `GET /api/lottery/draws` - Get recent draws
- `POST /api/lottery/purchase-ticket` - Purchase ticket
- `GET /api/lottery/my-tickets` - Get user tickets
- `GET /api/lottery/quick-pick` - Generate quick pick numbers
- `GET /api/lottery/statistics` - Get lottery statistics

### Admin (Admin only)
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `POST /api/admin/draws` - Create new draw
- `POST /api/admin/draws/:id/conduct` - Conduct draw
- `POST /api/admin/draws/schedule-next` - Schedule next draw

## 🧪 Development

### Project Structure
```
lottery-app/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main app component
├── backend/               # Backend source
│   ├── src/
│   │   ├── database/      # Database models and connection
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Main server file
│   └── package.json
└── README.md
```

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL`

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy with: `npm start`
3. Ensure database is accessible

### Database (Neon/Supabase)
1. Create PostgreSQL database
2. Run migrations: `npm run migrate`
3. Update `DATABASE_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Built with modern web technologies
- Secure lottery algorithm implementation
- Responsive design for all devices
- Production-ready architecture
