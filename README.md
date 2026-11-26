# BookNook – A Small Online Library

**Live Website:** https://booknook-client-oita.vercel.app

**Client Repository:** https://github.com/khaledaruna/booknook-client

BookNook is a small online library where readers can discover books, share books with the community, borrow available copies, and manage their reading history.

## Features

- **Browse Books:** Explore the public book collection with category filtering and book details.
- **Latest Arrivals:** Discover recently added books on the homepage.
- **User Authentication:** Register and log in securely using Better Auth, including Google authentication.
- **Add Books:** Logged-in users can add books with cover images uploaded through ImgBB.
- **Manage My Books:** Book owners can edit or delete their own book listings.
- **Borrow Books:** Borrow available books for a 14-day period.
- **Return Books:** Return borrowed books and view borrowing history.
- **Copy Availability:** Available copies automatically decrease when a book is borrowed and increase when returned.
- **Duplicate Borrow Protection:** Users cannot borrow the same book multiple times while an earlier borrow is active.
- **Responsive Design:** Designed for desktop, tablet, and mobile devices.

## Technology Stack

**Frontend**
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- DaisyUI and shadcn/ui
- Lucide React
- Sonner Toast Notifications
- Better Auth

**Backend and Database**
- Express.js
- TypeScript
- MongoDB
- JWT Authentication
- ImgBB Image Hosting

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/khaledaruna/booknook-client.git
cd booknook-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and configure the required variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

Configure any additional Better Auth and image-upload environment variables required by the project.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Create a production build

```bash
npm run build
```

## Project Links

-## Live API

- **Frontend:** https://boooknook-client-oitaa.vercel.app
- **Backend API:** https://booknook-server-v982.onrender.com

-## Repository Link 

- Frontend Repository: https://github.com/khaledaruna/booknook-client
- Backend Repository: https://github.com/khaledaruna/booknook-server

## Purpose

BookNook makes sharing, discovering, borrowing, and returning books simple through a community-focused online library.
