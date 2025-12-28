import axios, { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { ApiError } from '@/types/error';

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    // Network error
    if (!axiosError.response) {
      return 'Network error. Please check your connection.';
    }

    const { statusCode, message, errors } = axiosError.response.data;

    // Validation errors
    if (statusCode === 400 && errors && errors.length > 0) {
      const validationMessages = errors
        .map((err) => Object.values(err.constraints).join(', '))
        .join('\n');
      return validationMessages;
    }

    // Other errors
    return message || 'An error occurred';
  }

  // Unknown error
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const showErrorAlert = (error: unknown, title: string = 'Error') => {
  const message = handleApiError(error);
  Alert.alert(title, message);
};

// Get error message without showing alert
export const getErrorMessage = (error: unknown): string => {
  return handleApiError(error);
};

// Check if error is specific status code
export const isErrorStatus = (error: unknown, status: number): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === status;
  }
  return false;
};

// Check if it's a network error
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response;
  }
  return false;
};
