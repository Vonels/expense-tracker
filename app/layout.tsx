import type { Metadata } from "next";
import "./globals.css";

// если используешь next/font:
import { Inter } from "next/font/google";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
