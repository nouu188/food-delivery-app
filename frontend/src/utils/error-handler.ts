import axios, { AxiosError } from "axios";
import { ApiError } from "@/types/error";
import { useToastStore } from "@/store/useToastStore";

export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;

        // Network error
        if (!axiosError.response) {
            return "Network error. Please check your connection.";
        }

        const { statusCode, message, errors } = axiosError.response.data as any;

        const normalizeMessage = (value: unknown): string => {
            if (typeof value === "string") return value;
            if (Array.isArray(value)) {
                return value.filter((v) => typeof v === "string").join("\n") || "An error occurred";
            }
            return "An error occurred";
        };

        // Validation errors
        if (statusCode === 400 && errors && errors.length > 0) {
            const validationMessages = errors.map((err) => Object.values(err.constraints).join(", ")).join("\n");
            return validationMessages;
        }

        // Other errors
        return normalizeMessage(message) || "An error occurred";
    }

    // Unknown error
    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred";
};

export const showErrorAlert = (error: unknown, title: string = "Error") => {
    // If the Axios interceptor already showed a toast, don't show another.
    if ((error as any)?.__toastShown) return;

    const message = handleApiError(error);

    // Prefer in-app toast for better UX (avoid native Alert popups).
    useToastStore.getState().show({ type: "error", title, message });
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
