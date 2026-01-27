export type TransactionType = "incomes" | "expenses";

export interface CategoryData {
  _id: string;
  categoryName: string;
}

export interface TransactionsResponse {
  type: TransactionType;
  date?: string;
  search?: string;
}

export interface TransactionFormValues {
  date: string;
  time: string;
  category: string;
  sum: number;
  comment?: string;
  type: TransactionType;
}

export interface TransactionData {
  transaction: {
    _id: string;
    type: string;
    date: string;
    time: string;
    category: string;
    sum: number;
    comment: string;
  };
  total: number;
}
