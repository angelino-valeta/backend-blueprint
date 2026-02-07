import 'dotenv/config';
import * as http from 'http';
import { createApp } from './app';
import { getAppDataSource } from './config/database';
import getRedisClient from './config/redis';
import { initializeTelemetry } from './config/telemetry';
import { initializeWebSocket } from './websocket/websocket.server';
import { initializeCronJobs } from './cron/cron.scheduler';
import logger from './config/logger';

// Import queue processors
import './queues/email.queue';

async function bootstrap() {
    try {
        logger.info('Iniciando aplicação Backend Blueprint...');

        // Initialize telemetry first
        initializeTelemetry();

        // Initialize database
        const dataSource = await getAppDataSource();
        logger.info('Database conectado com sucesso');

        // Initialize Redis
        const redis = await getRedisClient();
        logger.info('Redis conectado com sucesso');

        // Create Express app
        const app = createApp();

        // Create HTTP server
        const port = parseInt(process.env.PORT || '3000');
        const server = http.createServer(app);

        // Initialize WebSocket
        initializeWebSocket(server);

        // Initialize cron jobs
        initializeCronJobs();

        // Start server
        server.listen(port, () => {
            logger.info(`Servidor HTTP rodando na porta ${port}`);
            logger.info(`WebSocket rodando na porta ${process.env.WEBSOCKET_PORT || '8080'}`);
            logger.info('Aplicação inicializada com sucesso! 🚀');
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM recebido. Encerrando aplicação...');

            server.close(async () => {
                logger.info('Servidor HTTP encerrado');

                try {
                    if (dataSource.isInitialized) {
                        await dataSource.destroy();
                        logger.info('Database desconectado');
                    }

                    await redis.quit();
                    logger.info('Redis desconectado');

                    logger.info('Aplicação encerrada com sucesso');
                    process.exit(0);
                } catch (error) {
                    logger.error('Erro ao encerrar aplicação', { error });
                    process.exit(1);
                }
            });
        });

    } catch (error: any) {
        logger.error('Erro fatal ao iniciar aplicação', {
            error: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
}

// Start the application
bootstrap();