import Link from "next/link";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

type BooksResponse = {
  success: boolean;
  message: string;
  data: Book[];
};

async function getBooks(): Promise<Book[]> {
  try {
    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");

    const res = await fetch(`${apiUrl}/books`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`);
    }

    const result: BooksResponse = await res.json();

    return result.success ? result.data : [];
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Explore Books
      </h1>

      {books.length === 0 ? (
        <div className="rounded-xl border border-base-300 bg-base-100 p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Books Available Yet
          </h2>
          <p className="mt-2 opacity-70">
            Our library is waiting for its first collection of books.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="card border border-base-200 bg-base-100 shadow-xl"
            >
              <figure className="relative h-48">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <span className="badge badge-outline">
                  {book.category}
                </span>

                <h2 className="card-title text-lg">
                  {book.title}
                </h2>

                <p className="text-sm opacity-75">
                  By {book.author}
                </p>

                <div className="card-actions mt-4 justify-end">
                  <Link
                    href={`/books/${book._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}