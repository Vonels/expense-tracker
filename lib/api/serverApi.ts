import { cookies } from "next/headers";
import { api } from "./api";

import type { User } from "@/types/user";
import type { Expense } from "@/types/expense";
import type { Income } from "@/types/income";
import type { ListResponse, SessionResponse } from "@/types/expense";

const getAuthHeaders = () => ({
  headers: {
    Cookie: cookies().toString(),
  },
});

// Все что связано с User
export const checkSession = async (externalCookie?: string) => {
  const cookieString = externalCookie || (await cookies()).toString();

  const res = await api.get<string>("/auth/session", {
    headers: { Cookie: cookieString },
  });
  return res;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/users/me", getAuthHeaders());
  return res.data;
};

// Расходи
export const fetchExpenses = async (
  params?: Record<string, string | number>
): Promise<ListResponse<Expense>> => {
  const res = await api.get<ListResponse<Expense>>("/expenses", {
    ...getAuthHeaders(),
    params,
  });
  return res.data;
};

// Доходи
export const fetchIncomes = async (
  params?: Record<string, string | number>
): Promise<ListResponse<Income>> => {
  const res = await api.get<ListResponse<Income>>("/incomes", {
    ...getAuthHeaders(),
    params,
  });
  return res.data;
};
