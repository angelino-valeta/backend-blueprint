import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_PRIVATE_KEY_PATH) {
  throw new Error('JWT_PRIVATE_KEY_PATH não configurado no .env');
}

if (!process.env.JWT_PUBLIC_KEY_PATH) {
  throw new Error('JWT_PUBLIC_KEY_PATH não configurado no .env');
}

const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf8');
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf8');

export const jwtConfig = {
  privateKey,
  publicKey,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
};
