const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1d'
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Error handler (must be last)
app.use(errorHandler);

// ----------------------------------------------------
// ADD THIS BLOCK FOR RENDER HEALTH CHECK / KEEP-ALIVE
// ----------------------------------------------------

// Health Check Route: This simple GET route tells monitoring services (like UptimeRobot) 
// that the server is alive and running successfully (HTTP 200 OK).
app.get('/status', (req, res) => {
    // Note: We use 200 status for success
    res.status(200).send({ message: 'Server is running and ready for API requests.' });
});

// ----------------------------------------------------

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`❌ Error: ${err.message}`);
    process.exit(1);
});
