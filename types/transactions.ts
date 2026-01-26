export type TransactionType = "incomes" | "expenses";

export interface CategoryData {
  _id: string;
  categoryName: string;
}

export interface TransactionData {
  _id: string;
  type: TransactionType;
  date: string;
  time: string;
  category: CategoryData;
  sum: number;
  comment: string;
}

export interface TransactionsResponse {
  type: TransactionType;
  date?: string;
  search?: string;
}
