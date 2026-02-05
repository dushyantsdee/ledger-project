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

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// frontend static files
app.use(express.static(path.join(__dirname, "frontend")));

// api routes
app.use("/api/user", userRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// server
app.listen(3000, () => {
  console.log("Server running on 3000");
});
