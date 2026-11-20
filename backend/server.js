const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home test
app.get("/", (req, res) => {
  res.json({
    message: "City Care Hospital Backend is Working"
  });
});

// Patient API test
app.get("/api/patients", (req, res) => {
  res.json({
    message: "Patient API is working"
  });
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:");
    console.log(error.message);
  });