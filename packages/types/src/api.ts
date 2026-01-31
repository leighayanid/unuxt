export interface ApiResponse<T = unknown> {
  data: T;
  success: true;
}

export interface ApiError {
  message: string;
  code: string;
  success: false;
  details?: Record<string, string[]>;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
