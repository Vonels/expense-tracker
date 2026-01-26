import { api } from "./api";
import type { User } from "@/types/user";
import type { AuthCredentials, LoginCredentials } from "@/types/auth";
import type { CategoryStat, Expense, ExpensesQuery } from "@/types/expense";
import type { Income, IncomesQuery } from "@/types/income";
import type { ListResponse } from "@/types/expense";
import { useAuthStore } from "@/lib/store/authStore";
import { TransactionData, TransactionsResponse } from "@/types/transactions";

// лоадер

api.interceptors.request.use((config) => {
  useAuthStore.getState().setLoading(true);
  return config;
});

api.interceptors.response.use(
  (response) => {
    useAuthStore.getState().setLoading(false);
    return response;
  },
  (error) => {
    useAuthStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

// Все что связано с User
export const register = async (values: AuthCredentials): Promise<User> => {
  const res = await api.post<User>("/auth/register", values);
  return res.data;
};

export const login = async (values: LoginCredentials): Promise<User> => {
  const res = await api.post<User>("/auth/login", values);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    return { success: false };
  }

  return res.json();
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

export const deleteIncome = async (id: string): Promise<void> => {
  await api.delete(`/incomes/${id}`);
};

export const fetchCurrentMonthStats = async (): Promise<CategoryStat[]> => {
  const res = await api.get<CategoryStat[]>("/stats/categories/current-month");
  return res.data;
};

export const getTransactionCategories = async ({
  type,
  date,
  search,
}: TransactionsResponse): Promise<TransactionData[]> => {
  const { data } = await api.get<TransactionData[]>(`/transactions/${type}`, {
    params: { date, search },
  });

  return data;
};
