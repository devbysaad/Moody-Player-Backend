const dotenv = require("dotenv");
const connectDB = require("./src/database/db");
const app = require("./src/app");

// Load environment variables
dotenv.config();

// Health check stays available via app.js as well
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!", status: "success" });
});

// Start server
const PORT = process.env.PORT || 3000;

// Start DB connection in background so server can still accept connections
connectDB()
  .then(() => {
    console.log("Database connection attempt finished");
  })
  .catch((err) => {
    console.error("Database connection error:", err?.message || err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});