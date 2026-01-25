import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "@/app/api/api";

export async function GET() {
  const cookieStore = cookies();

  try {
    const { data } = await api.get("/stats/categories/current-month", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const apiError = error as ApiError;

    return NextResponse.json(
      {
        error:
          apiError.response?.data?.error ??
          apiError.message ??
          "Failed to fetch category statistics",
      },
      {
        status: apiError.response?.status ?? 500,
      }
    );
  }
}
