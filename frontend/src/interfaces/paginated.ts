export interface PaginatedResponse<T = any> {
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  content?: T[];
}
