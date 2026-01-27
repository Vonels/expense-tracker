import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api/api";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const body = await req.json();
    console.log("BODY:", body);

    const data = await api.post(`/transactions`, body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data.data, { status: data.status });
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
