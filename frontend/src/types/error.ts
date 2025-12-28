export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
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
