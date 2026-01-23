import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
// import AuthProvider from "@/components/AuthProvider/AuthProvider";

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
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        {modal}
      </body>
    </html>
  );
}
