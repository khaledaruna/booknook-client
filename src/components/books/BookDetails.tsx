
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Library,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: {
    name: string;
    email: string;
  };
};

type ApiResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export function BookDetails({ id }: { id: string }) {
  const { data: session } = useSession();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest<ApiResponse<Book>>(`/books/${id}`, {
      signal: controller.signal,
    })
      .then((response) => {
        setBook(response.data);
        setStatus("ready");
      })
      .catch((error) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setStatus("error");
      });

    return () => controller.abort();
  }, [id]);

  async function confirmBorrow() {
    if (!book) return;

    if (!session?.user) {
      toast.error("Please log in before borrowing a book.");
      dialogRef.current?.close();
      return;
    }

    setBorrowing(true);

    try {
      await apiRequest("/borrows", {
        method: "POST",
        authenticated: true,
        body: JSON.stringify({ bookId: book._id }),
      });

      setBook((current) =>
        current
          ? {
              ...current,
              availableCopies: current.availableCopies - 1,
            }
          : current
      );

      dialogRef.current?.close();

      toast.success(`"${book.title}" has been added to your borrowed books.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "This book could not be borrowed."
      );
    } finally {
      setBorrowing(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="book-details-state" role="status">
        <span className="details-spinner" />
        <p>Preparing your reading experience...</p>
      </div>
    );
  }

  if (status === "error" || !book) {
    return (
      <div className="book-details-state" role="alert">
        <BookOpen size={36} />
        <h2>Book Not Found</h2>
        <p>We couldn't find this book in our collection.</p>
        <Link href="/books" className="details-back-button">
          <ArrowLeft size={16} />
          Back to All Books
        </Link>
      </div>
    );
  }

  const unavailable = book.availableCopies < 1;

  return (
    <>
      <main className="book-details-page">
        <div className="book-details-container">
          <Link href="/books" className="details-breadcrumb">
            <ArrowLeft size={16} />
            Back to Collection
          </Link>

          <article className="book-details-card">
            <div className="book-details-cover-wrap">
              <div className="book-details-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.image}
                  alt={`Cover of ${book.title}`}
                />
              </div>

              <span className="book-cover-category">
                {book.category}
              </span>
            </div>

            <div className="book-details-content">
              <div className="details-top-label">
                <span className="details-label-line" />
                BOOK DETAILS
              </div>

              <span className="details-category">
                {book.category}
              </span>

              <h1>{book.title}</h1>

              <p className="book-details-author">
                Written by <strong>{book.author}</strong>
              </p>

              <div className="details-divider" />

              <div className="details-availability">
                <div className="availability-icon">
                  {unavailable ? (
                    <Library size={20} />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                </div>

                <div>
                  <span className="availability-label">
                    CURRENT AVAILABILITY
                  </span>

                  <strong className={unavailable ? "stock-empty" : "stock-available"}>
                    {unavailable
                      ? "Currently unavailable"
                      : `${book.availableCopies} of ${book.totalCopies} copies available`}
                  </strong>
                </div>
              </div>

              <div className="details-description-wrap">
                <h2>About This Book</h2>
                <p className="book-details-description">
                  {book.description}
                </p>
              </div>

              <div className="details-added-by">
                <div className="added-by-icon">
                  <UserRound size={19} />
                </div>

                <div>
                  <span>CONTRIBUTED TO OUR LIBRARY BY</span>
                  <strong>{book.addedBy?.name || "BookNook Member"}</strong>
                  <small>{book.addedBy?.email || ""}</small>
                </div>
              </div>

              <button
                className="details-borrow-button"
                type="button"
                disabled={unavailable}
                onClick={() => {
                  if (!session?.user) {
                    toast.error("Please log in before borrowing a book.");
                    return;
                  }

                  dialogRef.current?.showModal();
                }}
              >
                <BookOpen size={19} />
                {unavailable ? "Currently Unavailable" : "Borrow This Book"}
              </button>

              <p className="details-borrow-note">
                Borrowing period: 14 days
              </p>
            </div>
          </article>
        </div>
      </main>

      <dialog
        className="book-borrow-dialog"
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current.close();
          }
        }}
      >
        <div className="book-dialog-content">
          <button
            className="book-dialog-close"
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close dialog"
          >
            ×
          </button>

          <div className="dialog-book-icon">
            <BookOpen size={27} />
          </div>

          <span className="dialog-eyebrow">CONFIRM YOUR BORROW</span>

          <h2>Ready to start reading?</h2>

          <p className="dialog-book-title">{book.title}</p>

          <p className="dialog-description">
            You're about to borrow this book from BookNook. Your
            return date will be 14 days from today.
          </p>

          <div className="dialog-user-info">
            <div className="dialog-user-icon">
              <UserRound size={19} />
            </div>

            <div>
              <strong>{session?.user.name}</strong>
              <small>{session?.user.email}</small>
            </div>
          </div>

          <div className="dialog-return-info">
            <span>Borrowing period</span>
            <strong>14 days</strong>
          </div>

          <div className="dialog-actions">
            <button
              className="dialog-cancel-button"
              type="button"
              disabled={borrowing}
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>

            <button
              className="dialog-confirm-button"
              type="button"
              disabled={borrowing}
              onClick={confirmBorrow}
            >
              {borrowing ? "Processing..." : "Confirm Borrow"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
