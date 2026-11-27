
import type { Metadata } from "next";
import { BookDetails } from "@/components/books/BookDetails";

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Book Details",
  description: "View book information and borrowing details at BookNook.",
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;

  return <BookDetails id={id} />;
}
