//app.js
const express = require("express");
const cors = require("cors");

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

//Routes
const contactRoutes = require("./app/routes/contact.route");
app.use("/api/contacts", contactRoutes);

module.exports = app;
