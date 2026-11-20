"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { apiRequest, ApiError } from "@/lib/api-client";
import type { Book, BooksApiResponse } from "@/types/book.types";

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBooks(signal?: AbortSignal) {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<BooksApiResponse>(
        "/books",
        { signal }
      );

      const latestBooks = [...(response.data ?? [])]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 6);

      setBooks(latestBooks);
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
  }

  useEffect(() => {
    const controller = new AbortController();

    loadBooks(controller.signal);

    return () => controller.abort();
  }, []);

  return (
    <section className="new-arrivals-section">
      <div className="new-arrivals-container">
        {/* Section heading */}
        <div className="new-arrivals-heading">
          <div>
            <span className="new-arrivals-eyebrow">
              <BookOpen size={15} />
              EXPLORE OUR COLLECTION
            </span>

            <h2>
              Fresh on the <span>Shelf.</span>
            </h2>

            <p>
              Discover the latest additions to our library.
              Your next favorite story might be waiting here.
            </p>
          </div>

          <Link
            href="/books"
            className="new-arrivals-view-all"
          >
            View all books
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="new-arrivals-message">
            <LoaderCircle className="animate-spin" size={30} />
            <p>Discovering new books...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="new-arrivals-message">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => loadBooks()}
              className="new-arrivals-retry"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && books.length === 0 && (
          <div className="new-arrivals-message">
            <BookOpen size={34} />
            <h3>No books have been added yet.</h3>
            <p>Check back soon for new additions to our library.</p>
          </div>
        )}

        {/* Book cards */}
        {!loading && !error && books.length > 0 && (
          <div className="new-arrivals-grid">
            {books.map((book) => (
              <article
                className="new-arrivals-card"
                key={book._id}
              >
                <Link
                  href={`/books/${book._id}`}
                  className="new-arrivals-image-link"
                >
                  <div className="new-arrivals-image">
                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        fill
                        unoptimized
                        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                        className="new-arrivals-cover"
                      />
                    ) : (
                      <div className="new-arrivals-image-placeholder">
                        <BookOpen size={42} />
                      </div>
                    )}

                    <span className="new-arrivals-category">
                      {book.category}
                    </span>
                  </div>
                </Link>

                <div className="new-arrivals-card-content">
                  <p className="new-arrivals-author">
                    BY {book.author}
                  </p>

                  <h3>
                    <Link href={`/books/${book._id}`}>
                      {book.title}
                    </Link>
                  </h3>

                  <div className="new-arrivals-card-footer">
                    <span
                      className={
                        book.availableCopies > 0
                          ? "new-arrivals-available"
                          : "new-arrivals-unavailable"
                      }
                    >
                      {book.availableCopies > 0
                        ? `${book.availableCopies} available`
                        : "Currently unavailable"}
                    </span>

                    <Link
                      href={`/books/${book._id}`}
                      aria-label={`View details for ${book.title}`}
                      className="new-arrivals-arrow"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom button */}
        {!loading && !error && books.length > 0 && (
          <div className="new-arrivals-bottom">
            <Link href="/books" className="new-arrivals-bottom-button">
              Explore all books
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}