import express from 'express';
import helmet from 'helmet';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { ipRateLimiter } from './middlewares/rate-limiter.middleware';
import { auditMiddleware } from './middlewares/audit.middleware';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import healthRoutes from './modules/health/health.routes';

export function createApp(): express.Application {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS (configure as needed)
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    // Body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging
    app.use(requestLoggerMiddleware);

    // Rate limiting
    app.use(ipRateLimiter);

    // Audit logging (before routes)
    app.use(auditMiddleware);

    // Health check (public, no auth)
    app.use('/health', healthRoutes);

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    // Root endpoint
    app.get('/', (req: express.Request, res: express.Response) => {
        res.json({
            message: 'Backend Blueprint API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                auth: '/api/auth',
                users: '/api/users',
            },
        });
    });

    // 404 handler
    app.use((req: express.Request, res: express.Response) => {
        res.status(404).json({
            success: false,
            error: {
                message: 'Rota não encontrada',
                path: req.path,
            },
        });
    });

    // Error handler (must be last)
    app.use(errorHandler);

    return app;
}
