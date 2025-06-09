import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeFirebase } from './services/firebase.js';
import { eventRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const startServer = async () => {
    // Initialize Firebase
    await initializeFirebase();

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body parser middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            message: 'Calendar Backend API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });

    // API routes
    app.use('/api/events', eventRoutes);

    // 404 handler
    app.use('*', (req, res) => {
        res.status(404).json({
            error: 'Not Found',
            message: `Route ${req.originalUrl} not found`
        });
    });

    // Global error handler
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📡 Health check: http://localhost:${PORT}/health`);
        console.log(`📅 Events API: http://localhost:${PORT}/api/events`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    return app;
};

// Start the server
startServer().catch(console.error);

export default startServer;
