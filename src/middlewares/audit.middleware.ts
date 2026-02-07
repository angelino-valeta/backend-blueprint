import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../modules/audit/audit.service';

// List of sensitive actions that should be audited
const AUDITED_ACTIONS = [
    'POST:/api/users',
    'PUT:/api/users/:id',
    'DELETE:/api/users/:id',
    'POST:/api/auth/login',
];

export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
    const actionKey = `${req.method}:${req.route?.path || req.path}`;

    if (!AUDITED_ACTIONS.includes(actionKey)) {
        return next();
    }

    const user = (req as any).user;
    if (!user) {
        return next();
    }

    // Capture response after it's sent
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
        // Log audit after successful response
        if (res.statusCode >= 200 && res.statusCode < 300) {
            AuditService.logAction({
                action: actionKey,
                entityId: req.params.id || 'N/A',
                entityType: req.path.split('/')[2] || 'unknown',
                userId: user.userId,
                details: {
                    method: req.method,
                    path: req.path,
                    body: req.body,
                    params: req.params,
                },
            }).catch(err => {
                console.error('Erro ao registrar auditoria:', err);
            });
        }

        return originalJson(data);
    };

    next();
}
