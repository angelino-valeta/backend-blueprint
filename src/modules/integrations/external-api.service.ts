import { HttpClientService } from './http-client.service';
import logger from '../../config/logger';

export class ExternalApiService {
    private httpClient: HttpClientService;

    constructor() {
        this.httpClient = new HttpClientService();
    }

    async fetchExternalData(endpoint: string): Promise<any> {
        try {
            const data = await this.httpClient.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
                },
            });

            logger.info('Dados externos obtidos com sucesso', { endpoint });
            return data;
        } catch (error: any) {
            logger.error('Erro ao buscar dados externos', {
                endpoint,
                error: error.message,
            });
            throw error;
        }
    }

    async sendDataToExternalApi(endpoint: string, payload: any): Promise<any> {
        try {
            const result = await this.httpClient.post(endpoint, payload, {
                headers: {
                    'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
                },
            });

            logger.info('Dados enviados para API externa com sucesso', { endpoint });
            return result;
        } catch (error: any) {
            logger.error('Erro ao enviar dados para API externa', {
                endpoint,
                error: error.message,
            });
            throw error;
        }
    }
}
