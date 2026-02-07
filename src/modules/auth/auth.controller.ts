import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { loginSchema, refreshTokenSchema } from '../../utils/validation.schemas';
import { createError } from '../../middlewares/error-handler.middleware';

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = loginSchema.safeParse(req.body);
            if (!validation.success) {
                throw createError(validation.error.errors[0].message, 400);
            }

            const { username, password } = validation.data;
            const ip = req.ip || 'unknown';

            const result = await AuthService.login(username, password, ip);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = refreshTokenSchema.safeParse(req.body);
            if (!validation.success) {
                throw createError(validation.error.errors[0].message, 400);
            }

            const { refreshToken } = validation.data;
            const result = await AuthService.refreshToken(refreshToken);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            if (!user) {
                throw createError('Usuário não autenticado', 401);
            }

            await AuthService.logout(user.userId);

            res.json({
                success: true,
                message: 'Logout realizado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }
}
