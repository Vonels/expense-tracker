// import { NextResponse } from "next/server";
// import { api, ApiError } from "../../api";
// import { cookies } from "next/headers";

// export async function PATCH(req: Request) {
//   const cookieStore = cookies();
//   const body = await req.json();

//   try {
//     const { data } = await api.patch("/users/info", body, {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       {
//         error:
//           (error as ApiError).response?.data?.error ??
//           (error as ApiError).message,
//       },
//       { status: (error as ApiError).status }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { api, ApiError } from "../../api";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();

  try {
    const { data } = await api.patch("/users/info", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const apiError = error as ApiError;

    const responseData = apiError.response?.data as
      | { message?: string; error?: string }
      | undefined;

    const errorMessage =
      responseData?.message ||
      responseData?.error ||
      apiError.message ||
      "Unknown server error";

    return NextResponse.json(
      { error: errorMessage },
      { status: apiError.response?.status || 500 }
    );
  }
}
