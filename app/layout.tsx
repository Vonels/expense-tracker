import type { Metadata } from "next";

import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Header from "@/components/HeaderUser/HeaderUser";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ToastProvider } from "@/components/ToastProvider/ToastProvider";

import AuthProvider from "@/components/AuthProvider/AuthProvider";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "ExpenseTracker",
    template: "%s | ExpenseTracker",
  },
  description: "Personal finance tracker: expenses & incomes.",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <TanStackProvider>
          <AuthProvider>
            <MantineProvider defaultColorScheme="dark">
              <Header />

              <main>{children}</main>

              {modal}

              <ToastProvider />
            </MantineProvider>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
