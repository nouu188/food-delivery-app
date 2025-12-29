import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '@/config/env';
import { handleApiError } from '@/utils/error-handler';
import { useToastStore } from '@/store/useToastStore';

const API_BASE_URL = ENV.API_URL;
const API_TIMEOUT = ENV.API_TIMEOUT;
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (ENV.ENABLE_LOGGING) {
            console.log(`[API Request] ${API_BASE_URL} ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        if (ENV.ENABLE_LOGGING) {
            console.log(`[API Response] ${response.config.url}`, response.data);
        }

        // Auto-toast backend success messages (when provided)
        try {
            const method = (response.config.method || 'get').toLowerCase();
            const shouldToast = method !== 'get' && method !== 'head';
            const data: any = response.data;
            const message = typeof data?.message === 'string' ? data.message : null;
            const skipToast = Boolean((response.config as any)?.toast?.success === false);

            if (shouldToast && message && !skipToast) {
                useToastStore.getState().show({ type: 'success', title: 'Success', message });
            }
        } catch {
            // ignore toast failures
        }

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (ENV.ENABLE_LOGGING) {
            // Don't log expected errors (conflict, unavailable items)
            const status = error.response?.status;
            const shouldLog = status !== 409 && status !== 400;

            if (shouldLog) {
                console.error(
                    `[API Error] ${error.response?.status || 'Network Error'} ${error.config?.url}`,
                    error.response?.data || error.message,
                );
            }
        }

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers!.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Call refresh token endpoint
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refresh_token: refreshToken,
                });

                const { access_token, refresh_token: newRefreshToken } = response.data;

                // Store new tokens
                await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token);
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

                // Update authorization header
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                originalRequest.headers!.Authorization = `Bearer ${access_token}`;

                processQueue(null, access_token);
                isRefreshing = false;

                // Retry original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null);
                isRefreshing = false;

                // Clear tokens and redirect to login will be handled by auth context
                await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);

                return Promise.reject(refreshError);
            }
        }

        // Auto-toast backend error messages (default-on). Mark to avoid double-toasting.
        try {
            const toastConfig = (originalRequest as any)?.toast;
            const skipToast = Boolean(toastConfig?.error === false);
            const status = error.response?.status;

            // Don't toast expected errors (conflict, unavailable items)
            const shouldSkipToast = skipToast || status === 409 || status === 400;

            if (!shouldSkipToast && !(error as any).__toastShown) {
                const message = handleApiError(error);
                useToastStore.getState().show({ type: 'error', title: 'Error', message });
                (error as any).__toastShown = true;
            }
        } catch {
            // ignore toast failures
        }

        return Promise.reject(error);
    },
);

export default apiClient;

// Helper functions
export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_TOKEN_KEY);
export const setTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};
export const clearTokens = async () => {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
};
