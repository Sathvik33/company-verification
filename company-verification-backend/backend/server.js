// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const path = require('path');
const helmet = require('helmet'); 

dotenv.config({ path: path.resolve(__dirname, '../.env') });

try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

// Import database connection and routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet()); 

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});