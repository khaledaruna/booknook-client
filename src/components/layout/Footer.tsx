import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer bg-[#1d3328] text-white py-16">
      <div className="container mx-auto px-4 pt-6 pb-4">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                <BookOpen size={21} strokeWidth={2.2} />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#c87955] ring-2 ring-[#c87955]" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Book<span className="text-[#c87955]">Nook</span>
              </span>
            </Link>
            <p className="footer-description text-[#c1cec3] text-xs leading-relaxed mt-4 max-w-sm">
              Your digital sanctuary for discovering, lending, and managing community book collections seamlessly. Read more, share knowledge, and connect with fellow book lovers.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-medium mb-4 text-white">Quick Links</h4>
            <div className="footer-links flex flex-col gap-2.5 text-xs text-[#c1cec3]">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/books" className="hover:text-white transition-colors">Explore All Books</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign In / Register</Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-medium mb-4 text-white">Community</h4>
            <div className="footer-links flex flex-col gap-2.5 text-xs text-[#c1cec3]">
              <span className="hover:text-white transition-colors cursor-pointer">Borrowing Guidelines</span>
              <span className="hover:text-white transition-colors cursor-pointer">Library Ethics</span>
              <span className="hover:text-white transition-colors cursor-pointer">Support & Feedback</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-white/10 text-xs text-[#b6c2b9]">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p>
          <p>Built with Next.js & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}