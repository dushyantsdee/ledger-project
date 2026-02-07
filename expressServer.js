require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

require("./db");

const userRoutes = require("./routes/userRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// FRONTEND (STATIC)
// ===============================
app.use(express.static(path.join(__dirname, "frontend")));

// ===============================
// API ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// ROOT
// ===============================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
