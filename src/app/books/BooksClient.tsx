"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Search,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import { apiRequest, ApiError } from "@/lib/api-client";
import type {
  Book,
  BooksApiResponse,
  BookCategory,
} from "@/types/book.types";

const categories = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

type CategoryFilter = (typeof categories)[number];

export default function BooksClient() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const loadBooks = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<BooksApiResponse>(
        "/books",
        { signal }
      );
      setBooks(response.data ?? []);
    } catch (err) {
      if (signal?.aborted) return;

      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to load books. Please try again."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadBooks(controller.signal);

    return () => controller.abort();
  }, [loadBooks]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);

      const matchesCategory =
        category === "All" ||
        book.category === (category as BookCategory);

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  return (
    <section className="min-h-screen bg-[#faf9f5] px-5 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[2px] text-[#bd7656]">
            <BookOpen size={16} />
            EXPLORE THE COLLECTION
          </span>

          <h1 className="font-serif text-4xl font-bold text-[#20392c] md:text-5xl">
            Discover Your Next
            <span className="block italic text-[#bd7656]">
              Favorite Book.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-600">
            Explore our growing collection of books.
            Find a story, learn something new, and
            discover your next great read.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center gap-3 rounded-xl border border-[#e8e5db] bg-white px-4 py-3 shadow-sm">
            <Search className="text-[#bd7656]" size={21} />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by book title or author..."
              className="w-full bg-transparent text-sm text-[#20392c] outline-none"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                category === item
                  ? "border-[#244c3a] bg-[#244c3a] text-white"
                  : "border-[#deded5] bg-white text-[#244c3a] hover:border-[#bd7656] hover:text-[#bd7656]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-[#244c3a]">
            <LoaderCircle size={35} className="animate-spin" />
            <p>Loading our book collection...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-16 text-center">
            <p className="mb-5 text-red-600">{error}</p>

            <button
              onClick={() => void loadBooks()}
              className="rounded-lg bg-[#244c3a] px-6 py-3 text-white hover:bg-[#bd7656]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Book collection */}
        {!loading && !error && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#20392c]">
                Our Collection
              </h2>

              <p className="text-sm text-gray-500">
                {filteredBooks.length} books found
              </p>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d9d6c9] py-20 text-center">
                <BookOpen size={40} className="mx-auto mb-4 text-[#bd7656]" />

                <h3 className="font-serif text-xl font-bold text-[#20392c]">
                  No books found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try another title, author or category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                  <article
                    key={book._id}
                    className="overflow-hidden rounded-xl border border-[#eeeae0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={`/books/${book._id}`} className="block">
                      <div className="relative h-72 overflow-hidden bg-[#f0ede4]">
                        <Image
                          src={book.image}
                          alt={`Cover of ${book.title}`}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 hover:scale-105"
                        />

                        <span className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 text-xs font-bold text-[#244c3a]">
                          {book.category}
                        </span>
                      </div>
                    </Link>

                    <div className="p-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#bd7656]">
                        By {book.author}
                      </p>

                      <h3 className="min-h-14 font-serif text-xl font-bold text-[#20392c]">
                        {book.title}
                      </h3>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eeeae0] pt-4">
                        <span
                          className={`text-xs font-semibold ${
                            book.availableCopies > 0
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          {book.availableCopies > 0
                            ? `${book.availableCopies} Available`
                            : "Not Available"}
                        </span>

                        <Link
                          href={`/books/${book._id}`}
                          className="inline-flex items-center gap-2 rounded-md bg-[#244c3a] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#bd7656]"
                        >
                          View Details
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}