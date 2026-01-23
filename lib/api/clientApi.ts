import { api } from "./api";
import type { User } from "@/types/user";
import type { AuthCredentials } from "@/types/auth";
import type { Expense, ExpensesQuery } from "@/types/expense";
import type { Income, IncomesQuery } from "@/types/income";
import type { ListResponse, SessionResponse } from "@/types/expense";

// Все что связано с User
export const register = async (values: AuthCredentials): Promise<User> => {
  const res = await api.post<User>("/auth/register", values);
  return res.data;
};

export const login = async (values: AuthCredentials): Promise<User> => {
  const res = await api.post<User>("/auth/login", values);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<SessionResponse> => {
  const res = await api.get<SessionResponse>("/auth/session");
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

// Расходи
export const fetchExpenses = async (
  params?: ExpensesQuery
): Promise<ListResponse<Expense>> => {
  const res = await api.get<ListResponse<Expense>>("/expenses", { params });
  return res.data;
};

export const createExpense = async (
  values: Omit<Expense, "id" | "createdAt" | "updatedAt">
): Promise<Expense> => {
  const res = await api.post<Expense>("/expenses", values);
  return res.data;
};

// Доходи
export const fetchIncomes = async (
  params?: IncomesQuery
): Promise<ListResponse<Income>> => {
  const res = await api.get<ListResponse<Income>>("/incomes", { params });
  return res.data;
};

export const createIncome = async (
  values: Omit<Income, "id" | "createdAt" | "updatedAt">
): Promise<Income> => {
  const res = await api.post<Income>("/incomes", values);
  return res.data;
};
