import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.CRYPTO_KEY) {
    throw new Error('CRYPTO_KEY não configurado no .env');
}

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.CRYPTO_KEY, 'utf8').subarray(0, 32);

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
