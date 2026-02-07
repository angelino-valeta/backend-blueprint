import { emailTransporter } from '../../config/email';
import { emailQueue } from '../../config/queue';
import logger from '../../config/logger';

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

export class EmailService {
    static async sendEmail(options: EmailOptions): Promise<void> {
        const mailOptions = {
            from: options.from || process.env.EMAIL_USER,
            to: Array.isArray(options.to) ? options.to.join(',') : options.to,
            subject: options.subject,
            html: options.html,
        };

        try {
            const info = await emailTransporter.sendMail(mailOptions);
            logger.info('Email enviado com sucesso', {
                messageId: info.messageId,
                to: options.to,
            });
        } catch (error: any) {
            logger.error('Erro ao enviar email', {
                error: error.message,
                to: options.to,
            });
            throw error;
        }
    }

    static async queueEmail(options: EmailOptions, delay?: number): Promise<void> {
        try {
            await emailQueue.add(
                'send-email',
                options,
                {
                    delay,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                }
            );

            logger.info('Email adicionado à fila', { to: options.to });
        } catch (error: any) {
            logger.error('Erro ao adicionar email à fila', {
                error: error.message,
                to: options.to,
            });
            throw error;
        }
    }
}
