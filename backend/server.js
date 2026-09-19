const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Medical Inventory API is working'
  });
});

const PORT = 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB();
});