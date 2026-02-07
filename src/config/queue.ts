import Queue from 'bull';
import * as dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
};

export const emailQueue = new Queue('email', redisConfig);
export const notificationQueue = new Queue('notification', redisConfig);

// Queue event listeners
emailQueue.on('error', (error: Error) => {
    console.error('Email queue error:', error);
});

emailQueue.on('completed', (job: any) => {
    console.log(`Email job ${job.id} completed`);
});

emailQueue.on('failed', (job: any, error: Error) => {
    console.error(`Email job ${job?.id} failed:`, error);
});
