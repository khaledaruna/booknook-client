
import Link from "next/link";
import { BookOpen, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#18392e] text-white">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <BookOpen size={26} />
            <span className="font-serif text-2xl font-bold">
              BookNook
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
            A welcoming place to discover books, share knowledge, and make
            reading part of everyday life.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Quick Links</h3>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <Link href="/books">Explore Books</Link>
            <Link href="/add-book">Add a Book</Link>
            <Link href="/my-borrows">My Borrows</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Contact</h3>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <Mail size={16} /> hello@booknook.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} /> Online Library
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {year} BookNook. All rights reserved.
      </div>
    </footer>
  );
}
