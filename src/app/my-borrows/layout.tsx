
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Borrows",
  description: "View and manage your borrowed books.",
};

export default function MyBorrowsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
