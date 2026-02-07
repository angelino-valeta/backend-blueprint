import getRedisClient from '../../config/redis';

const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
const JAIL_DURATION = parseInt(process.env.LOGIN_JAIL_DURATION || '900'); // 15 minutes in seconds

export class JailService {
    private static getKey(identifier: string): string {
        return `jail:${identifier}`;
    }

    private static getAttemptsKey(identifier: string): string {
        return `attempts:${identifier}`;
    }

    static async recordFailedAttempt(identifier: string): Promise<{ isJailed: boolean; attemptsLeft: number }> {
        const redis = await getRedisClient();
        const attemptsKey = this.getAttemptsKey(identifier);
        const jailKey = this.getKey(identifier);

        // Check if already jailed
        const isJailed = await redis.get(jailKey);
        if (isJailed) {
            return { isJailed: true, attemptsLeft: 0 };
        }

        // Increment attempts
        const attempts = await redis.incr(attemptsKey);

        // Set expiry on first attempt
        if (attempts === 1) {
            await redis.expire(attemptsKey, JAIL_DURATION);
        }

        // Check if should be jailed
        if (attempts >= MAX_ATTEMPTS) {
            await redis.setEx(jailKey, JAIL_DURATION, 'jailed');
            await redis.del(attemptsKey);
            return { isJailed: true, attemptsLeft: 0 };
        }

        return { isJailed: false, attemptsLeft: MAX_ATTEMPTS - attempts };
    }

    static async clearAttempts(identifier: string): Promise<void> {
        const redis = await getRedisClient();
        await redis.del(this.getAttemptsKey(identifier));
    }

    static async isJailed(identifier: string): Promise<boolean> {
        const redis = await getRedisClient();
        const result = await redis.get(this.getKey(identifier));
        return result !== null;
    }

    static async getJailTimeLeft(identifier: string): Promise<number> {
        const redis = await getRedisClient();
        const ttl = await redis.ttl(this.getKey(identifier));
        return ttl > 0 ? ttl : 0;
    }

    static async releaseJail(identifier: string): Promise<void> {
        const redis = await getRedisClient();
        await redis.del(this.getKey(identifier));
        await redis.del(this.getAttemptsKey(identifier));
    }
}
