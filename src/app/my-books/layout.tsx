import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Books",
  description: "Manage the books you have added to BookNook.",
};

export default function MyBooksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}