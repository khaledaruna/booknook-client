// app/books/page.tsx
import Link from "next/link";

async function getBooks() {
  try {
    const res = await fetch("http://localhost:5000/api/books", { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Books</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book: any) => (
          <div key={book._id} className="card bg-base-100 shadow-xl border border-base-200">
            <figure className="h-48 relative">
              <img src={book.image} alt={book.title} className="object-cover h-full w-full" />
            </figure>
            <div className="card-body">
              <span className="badge badge-outline">{book.category}</span>
              <h2 className="card-title text-lg">{book.title}</h2>
              <p className="text-sm opacity-75">By {book.author}</p>
              <div className="card-actions justify-end mt-4">
                <Link href={`/books/${book._id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}