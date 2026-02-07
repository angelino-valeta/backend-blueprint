import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Attach trace ID to request for downstream use
    (req as any).traceId = traceId;

    const start = Date.now();

    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        traceId,
    });

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            traceId,
        });
    });

    next();
}
