import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add a Book",
  description: "Add a new book to the BookNook library.",
};

export default function AddBookLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}