"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // adjust path if your Better Auth client is elsewhere

export default function AddBookPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please select a book cover image.");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload image to ImgBB via Next.js /api/upload
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success || !uploadData.url) {
        throw new Error(uploadData.message || "Failed to upload cover image.");
      }

      // 2. Create book in Express/MongoDB backend
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const bookPayload = {
        title: title.trim(),
        author: author.trim(),
        category,
        image: uploadData.url,
        description: description.trim(),
        totalCopies: Number(totalCopies),
        availableCopies: Number(totalCopies),
        addedBy: {
          name: session?.user?.name || "Anonymous",
          email: session?.user?.email || "",
        },
      };

      const createRes = await fetch(`${apiUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookPayload),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        throw new Error(createData.message || "Failed to add book.");
      }

      router.push("/books");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Add a New Book</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-base-300 bg-base-100 p-6 shadow"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Book Title</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Alchemist"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Author</span>
          </label>
          <input
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g., Paulo Coelho"
            className="input input-bordered w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Total Copies</span>
            </label>
            <input
              type="number"
              min={1}
              required
              value={totalCopies}
              onChange={(e) => setTotalCopies(Number(e.target.value))}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Book Cover Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Cover preview"
              className="mt-3 h-40 w-28 rounded object-cover border border-base-300"
            />
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Description</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short summary of the book..."
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Uploading & Saving..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}