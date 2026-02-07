import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { createUserSchema, updateUserSchema, userIdSchema } from '../../utils/validation.schemas';
import { createError } from '../../middlewares/error-handler.middleware';

export class UserController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = createUserSchema.safeParse(req.body);
            if (!validation.success) {
                throw createError(validation.error.errors[0].message, 400);
            }

            const user = await UserService.create(validation.data);

            res.status(201).json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.findAll();

            res.json({
                success: true,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = userIdSchema.safeParse(req.params);
            if (!validation.success) {
                throw createError(validation.error.errors[0].message, 400);
            }

            const user = await UserService.findById(validation.data.id);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const idValidation = userIdSchema.safeParse(req.params);
            if (!idValidation.success) {
                throw createError(idValidation.error.errors[0].message, 400);
            }

            const dataValidation = updateUserSchema.safeParse(req.body);
            if (!dataValidation.success) {
                throw createError(dataValidation.error.errors[0].message, 400);
            }

            const user = await UserService.update(idValidation.data.id, dataValidation.data);

            res.json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = userIdSchema.safeParse(req.params);
            if (!validation.success) {
                throw createError(validation.error.errors[0].message, 400);
            }

            await UserService.delete(validation.data.id);

            res.json({
                success: true,
                message: 'Usuário deletado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }
}
