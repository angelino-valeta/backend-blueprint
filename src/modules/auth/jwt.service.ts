import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt';

export interface TokenPayload {
    userId: number;
    username: string;
    roleId: number;
}

export interface RefreshTokenPayload extends TokenPayload {
    type: 'refresh';
}

export class JwtService {
    static generateAccessToken(payload: TokenPayload): string {
        return (jwt.sign as any)(payload, jwtConfig.privateKey, {
            algorithm: 'RS256',
            expiresIn: jwtConfig.accessTokenExpiry,
        });
    }

    static generateRefreshToken(payload: TokenPayload): string {
        const refreshPayload: RefreshTokenPayload = {
            ...payload,
            type: 'refresh',
        };

        return (jwt.sign as any)(refreshPayload, jwtConfig.privateKey, {
            algorithm: 'RS256',
            expiresIn: jwtConfig.refreshTokenExpiry,
        });
    }

    static verifyAccessToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, jwtConfig.publicKey, {
                algorithms: ['RS256'],
            }) as TokenPayload;

            return decoded;
        } catch (error: any) {
            throw new Error(`Token inválido: ${error.message}`);
        }
    }

    static verifyRefreshToken(token: string): RefreshTokenPayload {
        try {
            const decoded = jwt.verify(token, jwtConfig.publicKey, {
                algorithms: ['RS256'],
            }) as RefreshTokenPayload;

            if (decoded.type !== 'refresh') {
                throw new Error('Token não é um refresh token');
            }

            return decoded;
        } catch (error: any) {
            throw new Error(`Refresh token inválido: ${error.message}`);
        }
    }

    static decodeToken(token: string): any {
        return jwt.decode(token);
    }
}
