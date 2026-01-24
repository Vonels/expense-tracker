import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../api";
import { cookies } from "next/headers";

// Получичение списка
export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  try {
    const { searchParams } = new URL(req.url);

    const { data } = await api.get("/expenses", {
      params: Object.fromEntries(searchParams),
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}
// Отображение списка
export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = cookies();

  try {
    const { data } = await api.post("/expenses", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}
