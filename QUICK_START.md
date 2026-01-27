# Quick Start Guide - Project Xangoes

## ✅ Application Status: READY TO RUN

The application is fully integrated and ready to use!

---

## 🚀 How to Run

### Option 1: If servers are already running
The application should already be running. Just open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Option 2: Start from scratch

#### 1. Start Backend Server
```bash
cd server
bun run dev
```
Backend will run on: `http://localhost:5000`

#### 2. Start Frontend Server (in a new terminal)
```bash
cd client
bun run dev
```
Frontend will run on: `http://localhost:3000`

---

## 🎯 Quick Test Flow

### 1. Register a New User
1. Go to http://localhost:3000/sign-up
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: yourpassword
   - Confirm Password: yourpassword
3. Click "Create Account"
4. You'll be automatically logged in and redirected to dashboard

### 2. View Events
1. Click "Events" in the navigation bar
2. Or go directly to http://localhost:3000/events
3. You'll see 3 sample events displayed

### 3. Login (if you logged out)
1. Go to http://localhost:3000/login
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to dashboard

### 4. Dashboard
- After login, you'll see your dashboard at http://localhost:3000/dashboard
- Shows your name and upcoming events
- Logout button available

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user (requires Bearer token)

### Users
- `GET /api/users/profile` - Get user profile (requires Bearer token)
- `PUT /api/users/profile` - Update user profile (requires Bearer token)

### Events
- `GET /api/events` - List all events (query: ?page=1&limit=10&search=)
- `GET /api/events/:id` - Get event by ID

### Health Check
- `GET /health` - Server health check

---

## 🔧 Configuration

### Backend
- Port: 5000 (configurable via `PORT` env variable)
- CORS: Enabled for localhost:3000 and localhost:3001
- Database: Optional (works without DB using mock data)

### Frontend
- Port: 3000 (Next.js default)
- API URL: http://localhost:5000 (configurable via `NEXT_PUBLIC_API_URL`)

---

## 📝 Notes

- **Mock Data**: Currently uses in-memory storage. Data resets on server restart
- **Authentication**: Uses mock JWT tokens stored in localStorage
- **No Database Required**: Works perfectly without PostgreSQL for MVP
- **CORS**: Configured to allow frontend-backend communication

---

## ✅ What's Working

- ✅ User registration
- ✅ User login
- ✅ Protected routes (dashboard)
- ✅ Events listing
- ✅ API integration
- ✅ Token-based authentication
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive navigation

---

## 🎉 You're All Set!

The application is fully functional and ready to use. All unnecessary dev pages and test routes have been removed. The frontend and backend are properly integrated.

**Start using the application now!**
