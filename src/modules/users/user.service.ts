import { getAppDataSource } from '../../config/database';
import { User } from '../../infrastructure/entities/User';
import { Role } from '../../infrastructure/entities/Role';
import { hashPassword } from '../../utils/password.util';
import { createError } from '../../middlewares/error-handler.middleware';

export interface CreateUserDto {
    username: string;
    password: string;
    email?: string;
    roleId: number;
}

export interface UpdateUserDto {
    username?: string;
    password?: string;
    email?: string;
    roleId?: number;
}

export class UserService {
    static async create(data: CreateUserDto): Promise<User> {
        const dataSource = await getAppDataSource();
        const userRepo = dataSource.getRepository(User);
        const roleRepo = dataSource.getRepository(Role);

        // Check if username already exists
        const existingUser = await userRepo.findOne({ where: { username: data.username } });
        if (existingUser) {
            throw createError('Username já existe', 409);
        }

        // Check if email already exists (if provided)
        if (data.email) {
            const existingEmail = await userRepo.findOne({ where: { email: data.email } });
            if (existingEmail) {
                throw createError('Email já existe', 409);
            }
        }

        // Verify role exists
        const role = await roleRepo.findOne({ where: { id: data.roleId } });
        if (!role) {
            throw createError('Role não encontrada', 404);
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const user = userRepo.create({
            username: data.username,
            password: hashedPassword,
            email: data.email,
            role,
        });

        return userRepo.save(user);
    }

    static async findAll(): Promise<User[]> {
        const dataSource = await getAppDataSource();
        const userRepo = dataSource.getRepository(User);
        return userRepo.find({
            where: { isDeleted: false },
            relations: ['role'],
            select: ['id', 'username', 'email', 'isDeleted'],
        });
    }

    static async findById(id: number): Promise<User> {
        const dataSource = await getAppDataSource();
        const userRepo = dataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id, isDeleted: false },
            relations: ['role'],
            select: ['id', 'username', 'email', 'isDeleted'],
        });

        if (!user) {
            throw createError('Usuário não encontrado', 404);
        }

        return user;
    }

    static async update(id: number, data: UpdateUserDto): Promise<User> {
        const dataSource = await getAppDataSource();
        const userRepo = dataSource.getRepository(User);
        const roleRepo = dataSource.getRepository(Role);

        const user = await userRepo.findOne({ where: { id, isDeleted: false } });
        if (!user) {
            throw createError('Usuário não encontrado', 404);
        }

        // Check username uniqueness
        if (data.username && data.username !== user.username) {
            const existing = await userRepo.findOne({ where: { username: data.username } });
            if (existing) {
                throw createError('Username já existe', 409);
            }
            user.username = data.username;
        }

        // Check email uniqueness
        if (data.email && data.email !== user.email) {
            const existing = await userRepo.findOne({ where: { email: data.email } });
            if (existing) {
                throw createError('Email já existe', 409);
            }
            user.email = data.email;
        }

        // Update password
        if (data.password) {
            user.password = await hashPassword(data.password);
        }

        // Update role
        if (data.roleId) {
            const role = await roleRepo.findOne({ where: { id: data.roleId } });
            if (!role) {
                throw createError('Role não encontrada', 404);
            }
            user.role = role;
        }

        return userRepo.save(user);
    }

    static async delete(id: number): Promise<void> {
        const dataSource = await getAppDataSource();
        const userRepo = dataSource.getRepository(User);

        const user = await userRepo.findOne({ where: { id } });
        if (!user) {
            throw createError('Usuário não encontrado', 404);
        }

        // Soft delete
        user.isDeleted = true;
        await userRepo.save(user);
    }
}
