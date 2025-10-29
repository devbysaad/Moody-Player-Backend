const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const router = express.Router();

// Health check for auth routes
router.get("/health", (req, res) => {
  res.json({ status: "ok", route: "auth" });
});

// JWT Secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided.", status: "error" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token.", status: "error" });
  }
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email and password are required",
        status: "error" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters",
        status: "error" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ name }, { email: email.toLowerCase() }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Username or email already exists",
        status: "error" 
      });
    }

    // Create new user
    const newUser = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password 
    });
    
    res.status(201).json({ 
      message: "User registered successfully", 
      user: { 
        id: newUser._id, 
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt 
      },
      status: "success"
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      status: "error"
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // 🔍 Check inputs
    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required", status: "error" });
    }

    // 🔍 Find user by name
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: "error" });
    }

    // 🔍 Check password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password", status: "error" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      status: "success",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", status: "error" });
  }
});
// Get user profile (protected route)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        status: "error" 
      });
    }

    res.json({ 
      message: "Profile retrieved successfully", 
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email,
        createdAt: user.createdAt 
      },
      status: "success"
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      status: "error"
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ 
    message: "Logout successful",
    status: "success"
  });
});

// Verify authentication
router.get("/verify", verifyToken, (req, res) => {
  res.json({
    message: "User is authenticated",
    user: req.user,
    status: "success"
  });
});

module.exports = router;