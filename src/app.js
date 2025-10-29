const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const SongRoute = require("./routes/songs.routes");
const AuthRoute = require("./routes/auth.route");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,               // because you use withCredentials:true
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Mount the routes
app.use("/", SongRoute);
app.use("/auth", AuthRoute);

app.get("/test", (req, res) => {
  res.send("Backend working fine ✅");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.originalUrl });
});

module.exports = app;
