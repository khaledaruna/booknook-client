
import Link from "next/link";
import { BookOpen, Home, SearchX } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | BookNook",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-5 py-20">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
          <SearchX size={38} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Page Not Found
        </p>

        <h1 className="mb-5 text-5xl font-bold tracking-tight text-[#18392e] sm:text-7xl">
          404
        </h1>

        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          This page is not on our bookshelf.
        </h2>

        <p className="mx-auto mb-8 max-w-md leading-7 text-gray-600">
          The page may have been moved, removed, or the address may be
          incorrect. Let's help you find your next great read.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#18392e] px-6 py-3 font-semibold text-white transition hover:bg-[#285743]"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-lg border border-[#18392e] px-6 py-3 font-semibold text-[#18392e] transition hover:bg-emerald-50"
          >
            <BookOpen size={18} />
            Explore Books
          </Link>
        </div>
      </div>
    </main>
  );
}
