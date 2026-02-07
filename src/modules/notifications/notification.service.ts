import * as WebSocket from 'ws';
import { getWebSocketServer } from '../../websocket/websocket.server';
import logger from '../../config/logger';

export interface Notification {
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
}

export class NotificationService {
    static broadcast(notification: Notification): void {
        const wss = getWebSocketServer();

        if (!wss) {
            logger.warn('WebSocket server não inicializado');
            return;
        }

        const payload = JSON.stringify({
            ...notification,
            timestamp: new Date().toISOString(),
        });

        let sentCount = 0;
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
                sentCount++;
            }
        });

        logger.info('Notificação broadcast enviada', {
            type: notification.type,
            clientsCount: sentCount,
        });
    }

    static sendToClient(client: WebSocket, notification: Notification): void {
        if (client.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({
                ...notification,
                timestamp: new Date().toISOString(),
            });

            client.send(payload);
            logger.debug('Notificação enviada ao cliente', { type: notification.type });
        }
    }
}
