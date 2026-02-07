import { getAppDataSource } from '../../config/database';
import { User } from '../../infrastructure/entities/User';
import { comparePassword } from '../../utils/password.util';
import { JwtService } from './jwt.service';
import { JailService } from './jail.service';
import { createError } from '../../middlewares/error-handler.middleware';

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        email?: string;
    };
}

export class AuthService {
    static async login(username: string, password: string, ip: string): Promise<LoginResult> {
        const identifier = `${username}:${ip}`;

        // Check if jailed
        const isJailed = await JailService.isJailed(identifier);
        if (isJailed) {
            const timeLeft = await JailService.getJailTimeLeft(identifier);
            throw createError(
                `Conta temporariamente bloqueada. Tente novamente em ${Math.ceil(timeLeft / 60)} minutos.`,
                429
            );
        }

        // Find user
        const dataSource = await getAppDataSource();
        const userRepo = dataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { username, isDeleted: false },
            relations: ['role'],
        });

        if (!user) {
            await JailService.recordFailedAttempt(identifier);
            throw createError('Credenciais inválidas', 401);
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            const { isJailed: nowJailed, attemptsLeft } = await JailService.recordFailedAttempt(identifier);

            if (nowJailed) {
                throw createError(
                    `Muitas tentativas falhadas. Conta bloqueada por ${Math.ceil(parseInt(process.env.LOGIN_JAIL_DURATION || '900') / 60)} minutos.`,
                    429
                );
            }

            throw createError(`Credenciais inválidas. ${attemptsLeft} tentativa(s) restante(s).`, 401);
        }

        // Clear attempts on successful login
        await JailService.clearAttempts(identifier);

        // Generate tokens
        const payload = {
            userId: user.id,
            username: user.username,
            roleId: user.role.id,
        };

        const accessToken = JwtService.generateAccessToken(payload);
        const refreshToken = JwtService.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        };
    }

    static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = JwtService.verifyRefreshToken(refreshToken);

            // Verify user still exists
            const dataSource = await getAppDataSource();
            const userRepo = dataSource.getRepository(User);
            const user = await userRepo.findOne({
                where: { id: payload.userId, isDeleted: false },
            });

            if (!user) {
                throw createError('Usuário não encontrado', 404);
            }

            // Generate new access token
            const newAccessToken = JwtService.generateAccessToken({
                userId: payload.userId,
                username: payload.username,
                roleId: payload.roleId,
            });

            return { accessToken: newAccessToken };
        } catch (error: any) {
            throw createError('Refresh token inválido ou expirado', 401);
        }
    }

    static async logout(userId: number): Promise<void> {
        // In a stateless JWT system, logout is handled client-side by removing tokens
        // Here we could add token to a blacklist if needed
        // For now, just log the event
        console.log(`User ${userId} logged out`);
    }
}
