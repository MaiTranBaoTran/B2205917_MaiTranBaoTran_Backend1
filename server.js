const express = require("express");
const cors = require("cors");
const MongoDB = require("./app/utils/mongodb.util");
const ApiError = require("./app/api-error");
require("dotenv").config(); // <--- đọc .env

const app = express();
app.use(cors());
app.use(express.json());

const contactsRouter = require("./app/routes/contact.route");
app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await MongoDB.connect(process.env.MONGODB_URI);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
