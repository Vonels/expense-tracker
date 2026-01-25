import { NextResponse } from "next/server";
import { api, ApiError } from "../../api";
import { cookies } from "next/headers";

type Params = {
  params: { id: string };
};

export async function PATCH(req: Request, { params }: Params) {
  const cookieStore = cookies();
  const body = await req.json();

  try {
    const { data } = await api.patch(`/categories/${params.id}`, body, {
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

export async function DELETE(_: Request, { params }: Params) {
  const cookieStore = cookies();

  try {
    const { data } = await api.delete(`/categories/${params.id}`, {
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
