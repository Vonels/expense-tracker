import { NextResponse } from "next/server";
import { api, ApiError } from "../../api";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const formData = await req.formData();

  try {
    const { data } = await api.patch("/users/avatar", formData, {
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

export async function DELETE() {
  const cookieStore = cookies();

  try {
    const { data } = await api.delete("/users/avatar", {
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
