
const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Inventory Management API is running",
  });
});

// Start server
const PORT = 5000;

app.listen(PORT, async () => {
  try {
    await poolPromise;

    console.log("Connected to SQL Server!");
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
