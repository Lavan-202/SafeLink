export class AppError extends Error {
  statusCode: number;
  details?: Record<string, string>;

  constructor(message: string, statusCode = 400, details?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
