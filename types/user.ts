export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  type: "incomes" | "expenses";
}

export interface UserCategories {
  incomes: Category[];
  expenses: Category[];
}

export interface TransactionsTotal {
  incomes: number;
  expenses: number;
}

export interface UserNew {
  _id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  currency: "usd" | "eur" | "uah" | string;
  categories: UserCategories;
  transactionsTotal: TransactionsTotal;
}
