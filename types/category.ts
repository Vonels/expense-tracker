export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  createdAt: string;
}

export interface ApiErrorResponse {
  message: string;
}
