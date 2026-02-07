import * as cron from 'node-cron';
import logger from '../config/logger';
import { cleanupOldLogs } from './jobs/cleanup.job';

export function initializeCronJobs() {
    logger.info('Inicializando cron jobs...');

    // Cleanup old logs every day at 2 AM
    cron.schedule('0 2 * * *', async () => {
        logger.info('Executando job de limpeza de logs');
        try {
            await cleanupOldLogs();
            logger.info('Job de limpeza de logs concluído');
        } catch (error: any) {
            logger.error('Erro no job de limpeza de logs', { error: error.message });
        }
    });

    // Example: Health check every hour
    cron.schedule('0 * * * *', () => {
        logger.info('Health check executado via cron');
    });

    logger.info('Cron jobs inicializados com sucesso');
}
