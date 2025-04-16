export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPage: number;
    pageSize: number;
  };
}
