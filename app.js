const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();
app.use(cors());
app.use(express.json()); // <-- bắt buộc cho JSON body

app.use("/api/contacts", require("./app/routes/contact.route"));

app.use((req, res, next) => next(new ApiError(404, "Resource not found")));
app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
