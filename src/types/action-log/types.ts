import { User } from '@/types/user/types';

export interface ActionLog {
  id: number;
  userId?: number;
  timestamp: Date;
  action: string;
  details?: string;
  isError: boolean;
  user?: User;
}

export interface ActionLogData {
  paginatedActionLog: {
    items: ActionLog[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}
