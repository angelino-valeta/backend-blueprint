import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import logger from '../../config/logger';

export class HttpClientService {
    private client: AxiosInstance;

    constructor(baseURL?: string, timeout: number = 10000) {
        this.client = axios.create({
            baseURL: baseURL || process.env.EXTERNAL_API_URL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                logger.debug('HTTP Request', {
                    method: config.method,
                    url: config.url,
                    baseURL: config.baseURL,
                });
                return config;
            },
            (error) => {
                logger.error('HTTP Request Error', { error: error.message });
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                logger.debug('HTTP Response', {
                    status: response.status,
                    url: response.config.url,
                });
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Retry logic (max 3 attempts)
                if (!originalRequest._retry) {
                    originalRequest._retryCount = originalRequest._retryCount || 0;
                }

                if (originalRequest._retryCount < 2 && error.response?.status >= 500) {
                    originalRequest._retryCount++;
                    logger.warn('Retrying HTTP request', {
                        url: originalRequest.url,
                        attempt: originalRequest._retryCount,
                    });

                    // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
                    return this.client(originalRequest);
                }

                logger.error('HTTP Response Error', {
                    status: error.response?.status,
                    url: error.config?.url,
                    message: error.message,
                });

                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}
