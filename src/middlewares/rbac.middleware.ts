import { Request, Response, NextFunction } from 'express';
import { getAppDataSource } from '../config/database';
import { Role } from '../infrastructure/entities/Role';
import { createError } from './error-handler.middleware';
import { Permission } from '../modules/roles/permission.constants';

export function requirePermissions(...requiredPermissions: Permission[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;

            if (!user) {
                throw createError('Usuário não autenticado', 401);
            }

            // Fetch user's role with permissions
            const dataSource = await getAppDataSource();
            const roleRepo = dataSource.getRepository(Role);
            const role = await roleRepo.findOne({ where: { id: user.roleId } });

            if (!role) {
                throw createError('Role não encontrada', 403);
            }

            // Check if user has all required permissions
            const hasAllPermissions = requiredPermissions.every(permission =>
                role.permissions.includes(permission)
            );

            if (!hasAllPermissions) {
                throw createError('Permissão negada', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

// Shorthand for admin-only routes
export function requireAdmin() {
    return requirePermissions('system:admin' as Permission);
}
