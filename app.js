// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend server!" });
});
// Routes
const contactRoutes = require("./app/routes/contact.route");
app.use("/api/contacts", contactRoutes);

const ApiError = require("./app/api-error");

// Middleware handle 404
app.use((req, res, next) => {
  // Nếu không khớp route nào
  return next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi cuối cùng
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
