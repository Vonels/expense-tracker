import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "../../api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: NextRequest, { params }: Props) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const { data } = await api.delete(`/categories/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const err = error as ApiError;
    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status ?? 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const cookieStore = await cookies();
  const { id } = await params;
  const body = await req.json();

  try {
    const { data } = await api.patch(`/categories/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(data);
  } catch (error) {
    const err = error as ApiError;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
