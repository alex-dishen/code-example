import { ProductionIssueEnum } from 'services/production-workflow.model';

export type IdName = {
  id: string;
  name: string;
};

export type IdNameType = {
  id: string;
  name: string;
  type: string;
};

export type IdValue = {
  id: string;
  value: string;
};

export type IdNameOrder = { id: string; name: string; order: number };

export type ValueText = {
  value: string;
  text: string;
};

export type PaginatedResponse<T> = {
  data: T;
  meta: PaginationData;
};
export type PaginationData = {
  currentPage: number;
  lastPage: number;
  next: number | null;
  prev?: number | null;
  total: number;
  perPage: number;
};

export type FileItem = {
  id: string;
  name: string;
  link: string;
  isUploading?: boolean;
  progress?: number;
};

export type SortBy<T> = {
  sortBy: T;
  order: SortOrderOption;
};

export enum SortOrderOption {
  Ascending = 'asc',
  Descending = 'desc',
}
