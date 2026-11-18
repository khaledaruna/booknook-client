
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function Cta() {
  return (
    <section className="booknook-cta">
      <div className="booknook-cta-content">
        <div className="booknook-cta-icon">
          <BookOpen size={30} />
        </div>

        <p className="booknook-cta-eyebrow">
          YOUR NEXT CHAPTER STARTS HERE
        </p>

        <h2>
          Every reader deserves
          <span> a great story.</span>
        </h2>

        <p>
          Discover your next favorite book, share the stories you love,
          and become part of the BookNook reading community.
        </p>

        <Link href="/books" className="booknook-cta-button">
          Explore the collection
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
