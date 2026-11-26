"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, Pencil, Trash2, X, LoaderCircle, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import type { Book, BookCategory } from "@/types/book.types";

type BooksResponse = {
  success: boolean;
  message?: string;
  data: Book[];
};

type BookResponse = {
  success: boolean;
  message?: string;
  data: Book;
};

type BookForm = {
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
};

const initialForm: BookForm = {
  title: "",
  author: "",
  category: "Fiction",
  image: "",
  description: "",
  totalCopies: 1,
};

const categories: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchMyBooks = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiRequest<BooksResponse>(
        "/books?mine=true",
        { authenticated: true }
      );

      setBooks(response.data || []);
    } catch (error) {
      console.error("Failed to load my books:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load your books."
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

    fetchMyBooks();
  }, [isPending, session?.user, fetchMyBooks]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);

    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: book.totalCopies,
    });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingBook) return;

    try {
      setSaving(true);

      const response = await apiRequest<BookResponse>(
        `/books/${editingBook._id}`,
        {
          method: "PATCH",
          authenticated: true,
          body: JSON.stringify(formData),
        }
      );

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book._id === editingBook._id ? response.data : book
        )
      );

      setEditingBook(null);
      toast.success(response.message || "Book updated successfully!");
    } catch (error) {
      console.error("Book update failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update book."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      setDeletingId(bookId);

      await apiRequest<{ success: boolean; message?: string }>(
        `/books/${bookId}`,
        {
          method: "DELETE",
          authenticated: true,
        }
      );

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== bookId)
      );

      setConfirmDeleteId(null);
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Book deletion failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete book."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <main className="site-container flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="site-container py-20 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12" />
        <h1 className="text-3xl font-bold">My Books</h1>
        <p className="mt-3 text-muted-foreground">
          Please log in to manage your books.
        </p>
      </main>
    );
  }

  return (
    <main className="site-container min-h-screen py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
            BookNook Library
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">My Books</h1>
          <p className="mt-2 text-muted-foreground">
            Manage the books you have added to your library.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMyBooks}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total Books</p>
          <p className="mt-2 text-3xl font-bold">{books.length}</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total Copies</p>
          <p className="mt-2 text-3xl font-bold">
            {books.reduce((sum, book) => sum + book.totalCopies, 0)}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Available Copies</p>
          <p className="mt-2 text-3xl font-bold">
            {books.reduce((sum, book) => sum + book.availableCopies, 0)}
          </p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-16 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No books found</h2>
          <p className="mt-2 text-muted-foreground">
            You haven't added any books with this account yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <article
              key={book._id}
              className="overflow-hidden rounded-2xl border bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-3 p-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {book.category}
                  </span>

                  <h2 className="mt-1 text-xl font-bold">{book.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    by {book.author}
                  </p>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {book.description}
                </p>

                <div className="flex justify-between border-y py-3 text-sm">
                  <span>Total copies: {book.totalCopies}</span>
                  <span className="font-semibold">
                    Available: {book.availableCopies}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(book)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(book._id)}
                    disabled={deletingId === book._id}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === book._id ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                </div>

                {confirmDeleteId === book._id && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-800">
                      Delete "{book.title}" permanently?
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(book._id)}
                        disabled={deletingId === book._id}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === book._id ? "Deleting..." : "Confirm"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-md border px-3 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-background p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Book</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your book information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingBook(null)}
                disabled={saving}
                className="rounded-full p-2 hover:bg-muted"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  Book Title
                  <input
                    required
                    minLength={2}
                    maxLength={150}
                    value={formData.title}
                    onChange={(event) =>
                      setFormData({ ...formData, title: event.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium">
                  Author
                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    value={formData.author}
                    onChange={(event) =>
                      setFormData({ ...formData, author: event.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  Category
                  <select
                    value={formData.category}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        category: event.target.value as BookCategory,
                      })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium">
                  Total Copies
                  <input
                    type="number"
                    required
                    min={1}
                    max={1000}
                    value={formData.totalCopies}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        totalCopies: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-sm font-medium">
                Book Cover Image URL
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(event) =>
                    setFormData({ ...formData, image: event.target.value })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                Description
                <textarea
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>

              <div className="flex flex-wrap justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={saving}
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
                >
                  {saving ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}