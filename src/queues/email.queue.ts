import { emailQueue } from '../config/queue';
import { EmailService, EmailOptions } from '../modules/email/email.service';
import logger from '../config/logger';

// Process email queue jobs
emailQueue.process('send-email', async (job: any) => {
    const emailOptions: EmailOptions = job.data;

    logger.info('Processando job de email', {
        jobId: job.id,
        to: emailOptions.to,
    });

    try {
        await EmailService.sendEmail(emailOptions);
        logger.info('Job de email concluído', { jobId: job.id });
    } catch (error: any) {
        logger.error('Erro ao processar job de email', {
            jobId: job.id,
            error: error.message,
        });
        throw error; // Bull will retry based on job options
    }
});

logger.info('Email queue processor iniciado');
