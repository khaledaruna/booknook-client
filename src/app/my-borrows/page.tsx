// app/my-borrows/page.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

type BorrowRecord = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName?: string;
  borrowDate: string;
  returnDate: string;
  returned: boolean;
  createdAt: string;
};

type BorrowsApiResponse = {
  success: boolean;
  message: string;
  data: BorrowRecord[];
};

type ApiResponse = {
  success: boolean;
  message: string;
};

function formatDate(date: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = useSession();

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchBorrows = useCallback(async (signal?: AbortSignal) => {
    try {
      setError("");

      const response = await apiRequest<BorrowsApiResponse>("/borrows", {
        authenticated: true,
        signal,
      });

      setBorrows(response.data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your borrowed books."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetchBorrows(controller.signal);

    return () => controller.abort();
  }, [session, isPending, fetchBorrows]);

  const handleReturn = async (borrowId: string) => {
    try {
      setActionLoadingId(borrowId);

      const response = await apiRequest<ApiResponse>(
        `/borrows/${borrowId}`,
        {
          method: "DELETE",
          authenticated: true,
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to return the book.");
      }

      setBorrows((currentBorrows) =>
        currentBorrows.map((record) =>
          record._id === borrowId
            ? { ...record, returned: true }
            : record
        )
      );

      toast.success(response.message || "Book returned successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while returning the book."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-9 w-9 animate-spin text-[#244c3a]" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 rounded-full bg-[#edf2ed] p-5 text-[#244c3a]">
          <BookOpen size={36} />
        </div>

        <h1 className="text-2xl font-bold text-[#20392c]">
          Your Borrowing History
        </h1>

        <p className="mt-3 max-w-md text-gray-500">
          Please log in to see the books you have borrowed and manage your
          returns.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#244c3a] px-6 py-3 font-semibold text-white transition hover:bg-[#20392c]"
        >
          Log In
          <ArrowRight size={18} />
        </Link>
      </section>
    );
  }

  const activeBorrows = borrows.filter((record) => !record.returned).length;
  const returnedBorrows = borrows.filter((record) => record.returned).length;

  return (
    <main className="min-h-screen bg-[#faf9f5] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="mb-9">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#bd7656]">
            BookNook Library
          </span>

          <h1 className="mt-2 text-3xl font-bold text-[#20392c] sm:text-4xl">
            My Borrowed Books
          </h1>

          <p className="mt-3 max-w-xl text-gray-500">
            Keep track of your reading journey, check return dates, and manage
            your borrowed books.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-[#eeeae0] bg-white p-5 shadow-sm">
            <div className="rounded-full bg-[#edf2ed] p-3 text-[#244c3a]">
              <BookOpen size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Currently Borrowed</p>
              <p className="text-2xl font-bold text-[#20392c]">
                {activeBorrows}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#eeeae0] bg-white p-5 shadow-sm">
            <div className="rounded-full bg-[#f8eee8] p-3 text-[#bd7656]">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Books Returned</p>
              <p className="text-2xl font-bold text-[#20392c]">
                {returnedBorrows}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchBorrows();
              }}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
            >
              <RotateCcw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && borrows.length === 0 && (
          <div className="rounded-2xl border border-[#eeeae0] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf2ed] text-[#244c3a]">
              <BookOpen size={30} />
            </div>

            <h2 className="text-xl font-bold text-[#20392c]">
              No borrowed books yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
              Your reading journey starts here. Explore our collection and
              borrow your first book.
            </p>

            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#244c3a] px-6 py-3 font-semibold text-white transition hover:bg-[#20392c]"
            >
              Explore Books
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Borrowed Books */}
        {borrows.length > 0 && (
          <div className="space-y-4">
            {borrows.map((record) => {
              const isReturning = actionLoadingId === record._id;

              return (
                <article
                  key={record._id}
                  className="flex flex-col gap-5 rounded-2xl border border-[#eeeae0] bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                >
                  {/* Book Cover */}
                  <div className="h-36 w-28 shrink-0 overflow-hidden rounded-lg bg-[#f0ede4]">
                    {record.bookImage ? (
                      <img
                        src={record.bookImage}
                        alt={record.bookTitle || "Book cover"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#244c3a]">
                        <BookOpen size={32} />
                      </div>
                    )}
                  </div>

                  {/* Book Information */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          record.returned
                            ? "bg-gray-100 text-gray-600"
                            : "bg-[#f8eee8] text-[#a76142]"
                        }`}
                      >
                        {record.returned ? "Returned" : "Currently Borrowed"}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#20392c] sm:text-xl">
                      {record.bookTitle || "Unknown Book"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Borrowed by {record.userName || session.user.name}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-[#bd7656]" />
                        <span>
                          Borrowed: {formatDate(record.borrowDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#bd7656]" />
                        <span>
                          Due date: {formatDate(record.returnDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Return Action */}
                  <div className="shrink-0 sm:self-center">
                    {record.returned ? (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#edf2ed] px-4 py-3 text-sm font-semibold text-[#244c3a]">
                        <CheckCircle2 size={17} />
                        Returned
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReturn(record._id)}
                        disabled={isReturning}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#244c3a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20392c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {isReturning ? (
                          <>
                            <LoaderCircle size={17} className="animate-spin" />
                            Returning...
                          </>
                        ) : (
                          <>
                            <RotateCcw size={17} />
                            Return Book
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
