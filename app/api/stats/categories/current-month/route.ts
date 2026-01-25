import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "@/app/api/api";

export async function GET() {
  const cookieStore = await cookies();

  try {
    const { data } = await api.get("/stats/categories/current-month", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const apiError = error as ApiError;

    if (apiError.response?.status === 404) {
      return NextResponse.json([]);
    }

    return NextResponse.json(
      { error: apiError.message },
      { status: apiError.response?.status || 500 }
    );
  }
}
