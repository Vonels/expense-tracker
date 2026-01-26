// import { NextResponse } from "next/server";
// import { api, ApiError } from "../../api";
// import { cookies } from "next/headers";

// export async function GET() {
//   const cookieStore = await cookies();

//   try {
//     const { data } = await api.get("/users/current", {
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

export async function GET() {
  const cookieStore = await cookies();

  try {
    const { data } = await api.get("/users/current", {
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

    return NextResponse.json(
      {
        error:
          responseData?.message ||
          responseData?.error ||
          apiError.message ||
          "Unknown error",
      },
      { status: apiError.response?.status || 500 }
    );
  }
}
