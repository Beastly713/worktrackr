// 1. Import dependencies
require('dotenv').config(); // Loads .env file contents into process.env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const entryRoutes = require('./routes/entryRoutes');

connectDB();

// 2. Create Express app
const app = express();

// 3. Set up middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable a-pp to parse JSON request bodies

// 5. Mount Routes
// Any request starting with /api/users will be handled by userRoutes
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);

// 4. Create a test route
// This is to check if our server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the WorkTrackr server! 👋' });
});

// 5. Define the port and start the server
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});