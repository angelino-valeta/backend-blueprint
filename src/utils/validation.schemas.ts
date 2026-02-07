import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
    username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
    password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

// User schemas
export const createUserSchema = z.object({
    username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
    password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
    email: z.string().email('Email inválido').optional(),
    roleId: z.number().int().positive('Role ID deve ser um número positivo'),
});

export const updateUserSchema = z.object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    roleId: z.number().int().positive().optional(),
    password: z.string().min(6).optional(),
});

export const userIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser numérico').transform(Number),
});

// Email schema
export const sendEmailSchema = z.object({
    to: z.string().email('Email inválido'),
    subject: z.string().min(1, 'Assunto é obrigatório'),
    html: z.string().min(1, 'Conteúdo HTML é obrigatório'),
});
