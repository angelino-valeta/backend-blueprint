import getRedisClient from '../../config/redis';

export class CacheService {
    static async get<T>(key: string): Promise<T | null> {
        try {
            const redis = await getRedisClient();
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Erro ao buscar cache:', error);
            return null;
        }
    }

    static async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        try {
            const redis = await getRedisClient();
            const serialized = JSON.stringify(value);

            if (ttlSeconds) {
                await redis.setEx(key, ttlSeconds, serialized);
            } else {
                await redis.set(key, serialized);
            }
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    }

    static async delete(key: string): Promise<void> {
        try {
            const redis = await getRedisClient();
            await redis.del(key);
        } catch (error) {
            console.error('Erro ao deletar cache:', error);
        }
    }

    static async deletePattern(pattern: string): Promise<void> {
        try {
            const redis = await getRedisClient();
            const keys = await redis.keys(pattern);

            if (keys.length > 0) {
                await redis.del(keys);
            }
        } catch (error) {
            console.error('Erro ao deletar cache por padrão:', error);
        }
    }

    static async has(key: string): Promise<boolean> {
        try {
            const redis = await getRedisClient();
            const exists = await redis.exists(key);
            return exists === 1;
        } catch (error) {
            console.error('Erro ao verificar cache:', error);
            return false;
        }
    }

    static async getTTL(key: string): Promise<number> {
        try {
            const redis = await getRedisClient();
            return await redis.ttl(key);
        } catch (error) {
            console.error('Erro ao buscar TTL:', error);
            return -1;
        }
    }
}
