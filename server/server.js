const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "https://talentbridz.netlify.app",
    methods: ["GET", "POST"],
  },
});

// Make io accessible to routes
app.set("io", io);

// Socket.io connection handling
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
  });
});

app.set("onlineUsers", onlineUsers);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);
app.use(mongoSanitize());

// Rate limiting for auth routes - strict limits
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { message: "Too many login attempts. Please try again later." },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.user, // Don't count attempts from authenticated users
});

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests. Please try again later." },
});

// CORS - specifically allow configured origins only
app.use(
  cors({
    origin: "https://talentbridz.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 3600,
  }),
);

// Body parsing with size limits to prevent DoS
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Trust proxy - important for rate limiting behind reverse proxy
app.set("trust proxy", 1);

// Static files for uploads (with security considerations)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", generalLimiter, jobRoutes);
app.use("/api/applications", generalLimiter, applicationRoutes);
app.use("/api/profile", generalLimiter, profileRoutes);
app.use("/api/admin", generalLimiter, adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Talent Bridge API Server",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    availableRoutes: {
      auth: "/api/auth",
      jobs: "/api/jobs",
      applications: "/api/applications",
      profile: "/api/profile",
      admin: "/api/admin",
      health: "/api/health"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("CORS Origin:", req.get("origin"));
  next();
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", generalLimiter, jobRoutes);
app.use("/api/applications", generalLimiter, applicationRoutes);
app.use("/api/profile", generalLimiter, profileRoutes);
app.use("/api/admin", generalLimiter, adminRoutes);

// 404 handler - MUST be after all routes
app.use((req, res) => {
  console.log("❌ 404 NOT FOUND:", req.method, req.path);
  console.log("Available routes: /api/auth, /api/jobs, /api/applications, /api/profile, /api/admin");
  res.status(404).json({ 
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Error handler - MUST be last
app.use(errorHandler);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = { app, server };
