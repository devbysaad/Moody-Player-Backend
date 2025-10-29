const dotenv = require("dotenv");
dotenv.config(); // load env first

const connectDB = require("./src/database/db");
const app = require("./src/app");

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!", status: "success" });
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB safely (works on Vercel too)
connectDB()
  .then(() => {
    console.log("Database connection attempt finished");
  })
  .catch((err) => {
    console.error("Database connection error:", err?.message || err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
