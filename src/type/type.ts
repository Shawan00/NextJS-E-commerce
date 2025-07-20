export interface ErrorResponse {
  status: number;
  data: {
    message: string;
    error?: unknown;
  }
}