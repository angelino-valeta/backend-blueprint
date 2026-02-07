import { getAppDataSource } from '../../config/database';
import { Log } from '../../infrastructure/entities/Log';
import { LessThan } from 'typeorm';
import logger from '../../config/logger';

export async function cleanupOldLogs(): Promise<void> {
    try {
        const dataSource = await getAppDataSource();
        const logRepo = dataSource.getRepository(Log);

        // Delete logs older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await logRepo.delete({
            timestamp: LessThan(thirtyDaysAgo.toISOString()),
        });

        logger.info('Logs antigos removidos', {
            deletedCount: result.affected || 0,
            olderThan: thirtyDaysAgo.toISOString(),
        });
    } catch (error: any) {
        logger.error('Erro ao limpar logs antigos', { error: error.message });
        throw error;
    }
}
