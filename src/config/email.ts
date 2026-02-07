import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.EMAIL_HOST) {
    throw new Error('EMAIL_HOST não configurado no .env');
}

export const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration
emailTransporter.verify((error, success) => {
    if (error) {
        console.error('Erro na configuração do email:', error);
    } else {
        console.log('Servidor de email pronto para enviar mensagens');
    }
});
