// NestJS standard error response format
export interface ApiError {
  statusCode: number;
  message: string | string[]; // NestJS returns string for single error, array for validation errors
  error?: string; // Error type name (e.g., "Unauthorized", "Bad Request")
  timestamp?: string;
  path?: string;
  method?: string;
  // Custom validation errors (if using class-validator)
  errors?: Array<{
    property: string;
    constraints: Record<string, string>;
  }>;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}
