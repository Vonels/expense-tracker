import { api } from "./api";
import type { User, UserNew } from "@/types/user";
import type { AuthCredentials, LoginCredentials } from "@/types/auth";
import type { CategoryStat, Expense, ExpensesQuery } from "@/types/expense";
import type { Income, IncomesQuery } from "@/types/income";
import type { ListResponse } from "@/types/expense";
import {
  ICategory,
  CategoriesResponse,
  CreateCategoryDto,
} from "@/app/@modal/(.)categoriesModal/page";
import { useAuthStore } from "@/lib/store/authStore";
import {
  TransactionData,
  TransactionDelete,
  TransactionFormValues,
  TransactionsResponse,
  TransactionType,
  TransactionTypeData,
} from "@/types/transactions";

// лоадер

api.interceptors.request.use((config) => {
  useAuthStore.getState().setLoading(true);
  // Виправлення Пункту №3
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    useAuthStore.getState().setLoading(false);
    return response;
  },
  (error) => {
    useAuthStore.getState().setLoading(false);

    //Виправлення Пункту №3
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("sign-in")
      ) {
        window.location.href = "/sign-in";
      }
    }

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
  try {
    const res = await api.get("/auth/session");

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Session check failed:", error);
    return { success: false };
  }
};

export const getMe = async (): Promise<UserNew> => {
  const res = await api.get<UserNew>("/users/current");
  return res.data;
};

// Расходи
export const fetchExpenses = async (
  params?: ExpensesQuery
): Promise<ListResponse<Expense>> => {
  const res = await api.get<ListResponse<Expense>>("/expenses", { params });
  return res.data;
};

// Доходи
export const fetchIncomes = async (
  params?: IncomesQuery
): Promise<ListResponse<Income>> => {
  const res = await api.get<ListResponse<Income>>("/incomes", { params });
  return res.data;
};

export const getCategories = async (): Promise<CategoriesResponse> => {
  const res = await api.get<CategoriesResponse>("/categories");
  return res.data;
};

export const createCategory = async (
  payload: CreateCategoryDto
): Promise<ICategory> => {
  const res = await api.post<ICategory>("/categories", payload);
  return res.data;
};

export const updateCategory = async (
  id: string,
  name: string
): Promise<ICategory> => {
  const res = await api.patch<ICategory>(`/categories/${id}`, {
    categoryName: name,
  });
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
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
}: TransactionsResponse): Promise<TransactionTypeData[]> => {
  const { data } = await api.get<TransactionTypeData[]>(
    `/transactions/${type}`,
    {
      params: { date, search },
    }
  );

  return data;
};

export const deleteTransactionById = async (
  id: string
): Promise<TransactionDelete> => {
  const { data } = await api.delete<TransactionDelete>(
    `/transactions/id/${id}`
  );

  return data;
};

// Форма
export const createTransaction = async (
  values: TransactionFormValues
): Promise<TransactionData> => {
  const { data } = await api.post<TransactionData>(`/transactions`, values);

  return data;
};

export const updateTransaction = async (
  type: TransactionType,
  id: string,
  values: TransactionFormValues
): Promise<TransactionData> => {
  const path = `/transactions/${type}/${id}`;

  const payload = {
    date: values.date,
    time: values.time,
    category: values.category,
    sum: Number(values.sum),
    comment: values.comment,
  };

  const res = await api.patch<TransactionData>(path, payload);
  return res.data;
};
