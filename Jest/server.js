const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3008;

// Load environment variables only outside testing
if (process.env.NODE_ENV !== "test") {
  require("dotenv").config();
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const studentRoute = require("./src/routers/studentRoute");

app.use("/api", studentRoute);

// Connect database and start server only when running directly
if (require.main === module) {
  const connectDb = require("./src/config/DBConnect");

  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
      process.exit(1);
    });
}

module.exports = app;
