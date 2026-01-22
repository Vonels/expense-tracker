// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactNode, useState } from "react";

// type Props = {
//   children: ReactNode;
// };

// export default function TanStackProvider({ children }: Props) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60_000,
//             retry: 1,
//             refetchOnWindowFocus: false,
//           },
//         },
//       }),
//   );

//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }
