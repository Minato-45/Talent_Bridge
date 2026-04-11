# Talent Bridge - Job Listing Portal

A modern full-stack job listing platform built with React, Node.js, and MongoDB.

## 🎯 Features

- **Job Seeker Features**
  - Browse and search job listings
  - Apply to jobs
  - Manage applications
  - Create and update profile
  - Resume management

- **Recruiter Features**
  - Post and manage job listings
  - View applicants
  - Manage company profile
  - Track applications

- **Security**
  - Secure JWT authentication
  - Bcrypt password hashing
  - Role-based access control
  - Protected API endpoints

## 🛠️ Tech Stack

### Frontend

- React 19.1.0
- Vite 6.4.1
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcryptjs

### Database

- MongoDB (Local development)
- MongoDB Atlas (Production)

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

### Setup


1. **Clone the repository**

   ```bash
   git clone https://github.com/Minato-45/Talent_Bridge.git
   cd Talent_Bridge
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🚀 Running the Application

**Backend** (runs on [http://localhost:5000](http://localhost:5000))

```bash
cd server
npm start
```

**Frontend** (runs on [http://localhost:5173](http://localhost:5173))

```bash
cd client
npm run dev
```

## 🔐 Security

- **Environment Variables**: All sensitive data is stored in `.env` files (not committed to git)
- **Password Security**: Passwords are hashed with bcrypt (12 salt rounds)
- **Authentication**: JWT tokens with 7-day expiration
- **API Protection**: All sensitive endpoints require authentication

See [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for detailed security information.

##  Documentation

- [Security Checklist](./SECURITY_CHECKLIST.md) - Security implementation details
- [Server Security](./server/SECURITY.md) - Backend security guide
- [Client README](./client/README.md) - Frontend documentation

## 🚢 Deployment

For production deployment, ensure:
- MongoDB Atlas setup with proper authentication
- HTTPS/TLS enabled
- Environment variables properly configured
- JWT_SECRET rotated for production
- CORS configured for your domain

See [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for production deployment checklist.

## 📄 Project Structure

```text
Talent_Bridge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (AuthContext)
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/           # API configuration
│   │   └── App.jsx
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── .env.example       # Environment template
│   ├── server.js          # Entry point
│   └── package.json
├── SECURITY_CHECKLIST.md  # Security documentation
└── README.md              # This file
```

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Code follows project conventions
- No sensitive data is committed
- All `.env` files are excluded from git
- Tests are included for new features

## 📞 Support

For issues or questions, please check:

- [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)
- [Server Security Guide](./server/SECURITY.md)

## 📄 License

This project is licensed under the MIT License.

---

**Status**: ✅ Development Ready | Production Ready with additional setup

Last Updated: April 11, 2026
