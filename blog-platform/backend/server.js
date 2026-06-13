require('dotenv').config(); // ← MUST be first line
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      family: 4,
    });
    console.log('MongoDB Connected ✅');
  } catch (err) {
    console.log('DB Error:', err.message);
    setTimeout(connectDB, 5000);
  }
};

connectDB();
app.listen(5000, () => console.log('Server running on port 5000'));