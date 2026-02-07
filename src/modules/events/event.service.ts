import { getAppDataSource } from '../../config/database';
import { Event } from '../../infrastructure/entities/Event';

export interface EventData {
    eventType: string;
    entityId: string;
    entityType: string;
    userId?: number;
    data: Record<string, any>;
}

export class EventService {
    static async recordEvent(eventData: EventData): Promise<Event> {
        const dataSource = await getAppDataSource();
        const eventRepo = dataSource.getRepository(Event);

        const event = eventRepo.create({
            type: eventData.eventType,
            payload: eventData.data,
            userId: eventData.userId,
            timestamp: new Date().toISOString(),
        });

        return eventRepo.save(event);
    }

    static async getEventsByUser(userId: number): Promise<Event[]> {
        const dataSource = await getAppDataSource();
        const eventRepo = dataSource.getRepository(Event);

        return eventRepo.find({
            where: { userId },
            order: {
                timestamp: 'DESC',
            },
        });
    }
}
