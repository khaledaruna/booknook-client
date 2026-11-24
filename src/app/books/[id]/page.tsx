
import { notFound } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getBook(id: string) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to fetch book:", error);
    return null;
  }
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200">
        <figure className="max-w-sm">
          <img
            src={book.image}
            alt={book.title}
            className="object-cover w-full h-full"
          />
        </figure>

        <div className="card-body">
          <div className="flex gap-2">
            <span className="badge badge-primary">
              {book.category}
            </span>

            <span
              className={`badge ${
                book.availableCopies > 0
                  ? "badge-success"
                  : "badge-error"
              }`}
            >
              {book.availableCopies} Copies Available
            </span>
          </div>

          <h1 className="text-4xl font-bold">
            {book.title}
          </h1>

          <p className="text-lg opacity-80">
            Author: {book.author}
          </p>

          <p className="py-4">
            {book.description}
          </p>

          <div className="card-actions justify-end mt-6">
            <button
              className="btn btn-primary"
              disabled={book.availableCopies === 0}
            >
              {book.availableCopies > 0
                ? "Borrow Book"
                : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
