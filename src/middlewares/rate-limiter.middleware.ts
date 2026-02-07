import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// IP-based rate limiter
export const ipRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
        // Skip rate limiting for health checks
        return req.path === '/health';
    },
});

// User-based rate limiter (requires authentication)
export const userRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Higher limit for authenticated users
    message: 'Limite de requisições excedido para este usuário.',
    keyGenerator: (req: Request) => {
        const user = (req as any).user;
        return user?.id ? `user:${user.id}` : req.ip || 'unknown';
    },
});
