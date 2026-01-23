import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import { Category } from "@/types/category";

const API_URL = "https://expense-tracker-v2.b.goit.study/api";

interface ApiErrorResponse {
  message: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const { data } = await axios.get<Category[]>(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return NextResponse.json(
      { message: err.response?.data.message ?? "Failed to load categories" },
      { status: err.response?.status ?? 500 }
    );
  }
}

interface CreateCategoryDto {
  name: string;
  type: "income" | "expense";
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: CreateCategoryDto = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const { data } = await axios.post<Category>(`${API_URL}/categories`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;

    return NextResponse.json(
      { message: err.response?.data.message ?? "Failed to create category" },
      { status: err.response?.status ?? 500 }
    );
  }
}
