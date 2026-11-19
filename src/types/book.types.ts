
export type BookCategory =
  | "Fiction"
  | "Science"
  | "History"
  | "Kids"
  | "Others";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;

  addedBy: {
    name: string;
    email: string;
  };

  totalCopies: number;
  availableCopies: number;

  createdAt: string;
  updatedAt: string;
}

export interface BooksApiResponse {
  success: boolean;
  data: Book[];
  message?: string;
}
