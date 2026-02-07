import { Request, Response, NextFunction } from 'express';
import { getAppDataSource } from '../../config/database';
import getRedisClient from '../../config/redis';
import logger from '../../config/logger';

export class HealthController {
    static async checkHealth(req: Request, res: Response, next: NextFunction) {
        try {
            const health: any = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                services: {},
            };

            // Check database
            try {
                const dataSource = await getAppDataSource();
                if (dataSource.isInitialized) {
                    await dataSource.query('SELECT 1');
                    health.services.database = { status: 'healthy' };
                } else {
                    health.services.database = { status: 'unhealthy', error: 'Not initialized' };
                    health.status = 'unhealthy';
                }
            } catch (error: any) {
                health.services.database = { status: 'unhealthy', error: error.message };
                health.status = 'unhealthy';
            }

            // Check Redis
            try {
                const redis = await getRedisClient();
                await redis.ping();
                health.services.redis = { status: 'healthy' };
            } catch (error: any) {
                health.services.redis = { status: 'unhealthy', error: error.message };
                health.status = 'unhealthy';
            }

            const statusCode = health.status === 'healthy' ? 200 : 503;
            res.status(statusCode).json(health);
        } catch (error) {
            logger.error('Erro no health check', { error });
            next(error);
        }
    }
}
