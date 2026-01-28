import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const type = (await params).type;
  const search = req.nextUrl.searchParams.get("search");
  const date = req.nextUrl.searchParams.get("date");

  try {
    const cookieStore = await cookies();

    const queryParams: Record<string, string> = {};
    if (search) queryParams.search = search;
    if (date) queryParams.date = date;

    const data = await api.get(`/transactions/${type}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: queryParams,
    });

    return NextResponse.json(data.data);
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
