// app/borrows/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BorrowRecord {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
    image: string;
  };
  borrowDate: string;
  dueDate: string;
  status: "borrowed" | "returned";
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchBorrows = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("http://localhost:5000/api/borrows/my-borrows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch borrow records");
      }

      setBorrows(data.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleReturn = async (borrowId: string) => {
    try {
      setActionLoadingId(borrowId);
      const token = localStorage.getItem("token") || "";

      const res = await fetch(`http://localhost:5000/api/borrows/${borrowId}/return`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to return book");
      }

      // Refresh the list after returning
      await fetchBorrows();
    } catch (err: any) {
      alert(err.message || "Error returning book");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">My Borrowed Books</h1>

      {error && (
        <div className="alert alert-error mb-6 shadow-sm">
          <span>{error}</span>
        </div>
      )}

      {borrows.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-box border border-base-200">
          <p className="text-lg opacity-70 mb-4">You have not borrowed any books yet.</p>
          <button onClick={() => router.push("/books")} className="btn btn-primary">
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow-xl border border-base-200">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((record) => {
                const book = record.bookId;
                return (
                  <tr key={record._id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 relative">
                            {book?.image ? (
                              <img src={book.image} alt={book.title || "Book Cover"} />
                            ) : (
                              <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-xs">No img</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{book?.title || "Unknown Title"}</div>
                          <div className="text-sm opacity-50">{book?.author || "Unknown Author"}</div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(record.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${record.status === "borrowed" ? "badge-warning" : "badge-ghost"}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {record.status === "borrowed" && (
                        <button
                          onClick={() => handleReturn(record._id)}
                          className={`btn btn-sm btn-outline btn-error ${actionLoadingId === record._id ? "loading" : ""}`}
                          disabled={actionLoadingId === record._id}
                        >
                          {actionLoadingId === record._id ? "Returning..." : "Return Book"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}