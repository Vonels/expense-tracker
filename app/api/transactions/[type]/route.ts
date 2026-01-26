import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const type = (await params).type;

  try {
    const cookieStore = await cookies();

    const data = await api.get(`/transactions/${type}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
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
