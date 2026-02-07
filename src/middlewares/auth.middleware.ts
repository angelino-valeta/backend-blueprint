import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../modules/auth/jwt.service';
import { createError } from './error-handler.middleware';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError('Token não fornecido', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer '

        const payload = JwtService.verifyAccessToken(token);

        // Attach user to request
        (req as any).user = payload;

        next();
    } catch (error: any) {
        next(createError(error.message || 'Token inválido', 401));
    }
}
