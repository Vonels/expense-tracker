import { TransactionType } from "./transactions";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  createdAt: string;
}

export interface ApiErrorResponse {
  message: string;
}
