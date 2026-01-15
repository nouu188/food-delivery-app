import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types/error';
import { useToastStore } from '@/store/useToastStore';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
    'Invalid credentials': 'Email or password is incorrect. Please try again.',
    'User already exists': 'An account with this email already exists.',
    'Invalid or expired OTP': 'The OTP code you entered is invalid or has expired.',
    'Invalid email': 'Please enter a valid email address.',
    'Invalid or expired refresh token': 'Your session has expired. Please log in again.',
    'Invalid registration data': 'Please check your registration information and try again.',
    'Invalid login data': 'Please check your login information and try again.',
    'Invalid refresh token payload': 'Session error. Please log in again.',
    'Registration failed': 'Unable to create account. Please try again.',
    'Login failed': 'Unable to log in. Please try again.',
    'Failed to refresh token': 'Session expired. Please log in again.',
    'Failed to process forgot password': 'Unable to process password reset. Please try again.',
    'Failed to reset password': 'Unable to reset password. Please try again.',
    'Failed to verify OTP': 'Unable to verify OTP. Please try again.',

    'User not found': 'No account found with this email address.',
    'Invalid password': 'The password you entered is incorrect.',
    'Email already exists': 'An account with this email already exists.',
    'Invalid OTP': 'The OTP code you entered is invalid or has expired.',
    'OTP expired': 'The OTP code has expired. Please request a new one.',
    'Too many attempts': 'Too many failed attempts. Please try again later.',
    'Account not verified': 'Please verify your email address before logging in.',
    'Account disabled': 'Your account has been disabled. Please contact support.',
    'Token expired': 'Your session has expired. Please log in again.',
    'Invalid token': 'Invalid authentication token. Please log in again.',
    'Internal authentication error': 'An authentication error occurred. Please try again.',
};

const normalizeMessage = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value.filter((v) => typeof v === 'string').join('\n') || 'An error occurred';
    }
    return 'An error occurred';
};

const getAuthErrorMessage = (message: string, statusCode: number): string => {
    const mappedMessage = AUTH_ERROR_MESSAGES[message];
    if (mappedMessage) return mappedMessage;

    const messageKey = Object.keys(AUTH_ERROR_MESSAGES).find(key =>
        message.toLowerCase().includes(key.toLowerCase())
    );
    if (messageKey) return AUTH_ERROR_MESSAGES[messageKey];

    switch (statusCode) {
        case 401:
            return 'Authentication failed. Please check your credentials and try again.';
        case 403:
            return 'You do not have permission to perform this action.';
        case 404:
            return 'The requested resource was not found.';
        case 409:
            return 'An account with this email already exists. Please try another email.';
        case 422:
            return 'The data provided is invalid. Please check your input.';
        case 429:
            return 'Too many requests. Please wait a moment and try again.';
        default:
            return message;
    }
};

const formatValidationErrors = (errors: any[]): string => {
    if (!errors || errors.length === 0) return 'Validation failed';

    const messages = errors.map(err => {
        if (err.constraints) {
            return Object.values(err.constraints).join(', ');
        }
        if (err.message) {
            return err.message;
        }
        return 'Invalid input';
    });

    return messages.join('\n');
};

export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;

        if (!axiosError.response) {
            return 'Network error. Please check your internet connection and try again.';
        }

        const statusCode = axiosError.response.status;
        const data = axiosError.response.data as any;

        const { message, errors } = data || {};

        if (errors && Array.isArray(errors) && errors.length > 0 && errors[0]?.constraints) {
            return formatValidationErrors(errors);
        }

        if (message && Array.isArray(message)) {
            return message.join('\n');
        }

        if (message && typeof message === 'string') {
            return getAuthErrorMessage(message, statusCode);
        }

        switch (statusCode) {
            case 400:
                return 'Invalid request. Please check your input.';
            case 401:
                return 'Authentication failed. Please check your credentials.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 409:
                return 'This action conflicts with existing data.';
            case 500:
                return 'Server error. Please try again later.';
            case 502:
            case 503:
            case 504:
                return 'Service temporarily unavailable. Please try again later.';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};

export const showErrorAlert = (error: unknown, title: string = 'Error') => {
    // If the Axios interceptor already showed a toast, don't show another.
    if ((error as any)?.__toastShown) return;

    const message = handleApiError(error);

    // Prefer in-app toast for better UX (avoid native Alert popups).
    useToastStore.getState().show({ type: 'error', title, message });
};

export const getErrorMessage = (error: unknown): string => {
    return handleApiError(error);
};

export const isErrorStatus = (error: unknown, status: number): boolean => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === status;
    }
    return false;
};

export const isNetworkError = (error: unknown): boolean => {
    if (axios.isAxiosError(error)) {
        return !error.response;
    }
    return false;
};

export const isAuthError = (error: unknown): boolean => {
    return isErrorStatus(error, 401);
};

export const isValidationError = (error: unknown): boolean => {
    return isErrorStatus(error, 400);
};

export const isPermissionError = (error: unknown): boolean => {
    return isErrorStatus(error, 403);
};

export const isNotFoundError = (error: unknown): boolean => {
    return isErrorStatus(error, 404);
};

export const isConflictError = (error: unknown): boolean => {
    return isErrorStatus(error, 409);
};

export const isServerError = (error: unknown): boolean => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        return status ? status >= 500 && status < 600 : false;
    }
    return false;
};

export const showSuccessToast = (message: string, title: string = 'Success') => {
    useToastStore.getState().show({ type: 'success', title, message });
};

export const showInfoToast = (message: string, title: string = 'Info') => {
    useToastStore.getState().show({ type: 'info', title, message });
};

export const showWarningToast = (message: string, title: string = 'Warning') => {
    useToastStore.getState().show({ type: 'warning', title, message });
};

export const getValidationErrors = (error: unknown): Record<string, string[]> | null => {
    if (!axios.isAxiosError(error)) return null;

    const data = error.response?.data as any;
    const errors = data?.errors;

    if (!errors || !Array.isArray(errors)) return null;

    const validationErrors: Record<string, string[]> = {};
    errors.forEach((err: any) => {
        if (err.property && err.constraints) {
            validationErrors[err.property] = Object.values(err.constraints);
        }
    });

    return Object.keys(validationErrors).length > 0 ? validationErrors : null;
};

export const handleErrorWithCallback = (
    error: unknown,
    callbacks: {
        onAuth?: () => void;
        onValidation?: (errors: Record<string, string[]>) => void;
        onPermission?: () => void;
        onNotFound?: () => void;
        onConflict?: () => void;
        onServer?: () => void;
        onNetwork?: () => void;
        onDefault?: (message: string) => void;
    }
) => {
    if (isNetworkError(error) && callbacks.onNetwork) {
        callbacks.onNetwork();
    } else if (isAuthError(error) && callbacks.onAuth) {
        callbacks.onAuth();
    } else if (isValidationError(error) && callbacks.onValidation) {
        const validationErrors = getValidationErrors(error);
        if (validationErrors) {
            callbacks.onValidation(validationErrors);
        } else if (callbacks.onDefault) {
            callbacks.onDefault(handleApiError(error));
        }
    } else if (isPermissionError(error) && callbacks.onPermission) {
        callbacks.onPermission();
    } else if (isNotFoundError(error) && callbacks.onNotFound) {
        callbacks.onNotFound();
    } else if (isConflictError(error) && callbacks.onConflict) {
        callbacks.onConflict();
    } else if (isServerError(error) && callbacks.onServer) {
        callbacks.onServer();
    } else if (callbacks.onDefault) {
        callbacks.onDefault(handleApiError(error));
    }
};
