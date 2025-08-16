const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const vehicleRoutes = require('./routes/vehicleRoutes');

const dashboardRoutes = require('./routes/dashboardRoutes');

const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
