import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../modules/cache/cache.service';

interface CacheOptions {
    ttl?: number; // Time to live in seconds
    keyGenerator?: (req: Request) => string;
}

export function cacheMiddleware(options: CacheOptions = {}) {
    const defaultKeyGenerator = (req: Request) => {
        const user = (req as any).user;
        const userId = user?.userId || 'anonymous';
        return `cache:${req.method}:${req.path}:${userId}:${JSON.stringify(req.query)}`;
    };

    const keyGenerator = options.keyGenerator || defaultKeyGenerator;
    const ttl = options.ttl || 300; // Default 5 minutes

    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = keyGenerator(req);

        try {
            // Check cache
            const cachedData = await CacheService.get(cacheKey);

            if (cachedData) {
                return res.json(cachedData);
            }

            // Intercept res.json to cache the response
            const originalJson = res.json.bind(res);
            res.json = function (data: any) {
                // Cache on successful response
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    CacheService.set(cacheKey, data, ttl).catch(err => {
                        console.error('Erro ao cachear resposta:', err);
                    });
                }

                return originalJson(data);
            };

            next();
        } catch (error) {
            // If cache fails, continue without it
            console.error('Erro no cache middleware:', error);
            next();
        }
    };
}
