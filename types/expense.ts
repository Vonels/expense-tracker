export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpensesQuery {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

export interface SessionResponse {
  success: boolean;
}

export interface CategoryStat {
  _id: string;
  totalAmount: number;
  category: string;
}
