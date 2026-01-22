export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomesQuery {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}
