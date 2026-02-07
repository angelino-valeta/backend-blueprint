import * as WebSocket from 'ws';
import * as http from 'http';
import logger from '../config/logger';

let wss: WebSocket.Server | null = null;

export function initializeWebSocket(server: http.Server) {
    const port = parseInt(process.env.WEBSOCKET_PORT || '8080');

    wss = new WebSocket.Server({ server, path: '/ws' });

    wss.on('connection', (ws: WebSocket, req) => {
        const clientIp = req.socket.remoteAddress;
        logger.info('Novo cliente WebSocket conectado', { clientIp });

        ws.on('message', (message: string) => {
            logger.debug('Mensagem recebida do cliente', { message: message.toString() });

            // Echo back to sender
            ws.send(JSON.stringify({
                type: 'echo',
                data: message.toString(),
            }));
        });

        ws.on('close', () => {
            logger.info('Cliente WebSocket desconectado', { clientIp });
        });

        ws.on('error', (error) => {
            logger.error('Erro no WebSocket', { error: error.message, clientIp });
        });

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'welcome',
            message: 'Conectado ao servidor WebSocket',
        }));
    });

    logger.info(`Servidor WebSocket iniciado na porta ${port}`);
}

export function getWebSocketServer(): WebSocket.Server | null {
    return wss;
}
