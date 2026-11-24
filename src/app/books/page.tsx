import type { Metadata } from "next";
import BooksClient from './BooksClient';

export const metadata: Metadata = {
  title: "All Books",
  description:
    "Explore the complete BookNook library collection.",
};

export default function BooksPage() {
  return <BooksClient />;
}