
import { BookOpen, Library, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Discover Great Stories",
    description:
      "Explore a growing collection of books across different genres and find your next favorite read.",
  },
  {
    icon: Library,
    title: "Build Your Library",
    description:
      "Share books with the community and manage the books you contribute to BookNook.",
  },
  {
    icon: Users,
    title: "Read Together",
    description:
      "Join a community of readers, borrow books, and enjoy the stories that bring us together.",
  },
];

export function HomeFeatures() {
  return (
    <section className="bg-[#faf9f5] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b47b45]">
            The BookNook Experience
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#20392c] md:text-4xl">
            Why Readers Choose BookNook
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            More than a library, BookNook is a place to discover stories,
            share knowledge, and connect through reading.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-[#e9e5dc] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#eaf0e9] text-[#244c3a]">
                  <Icon size={28} />
                </div>

                <h3 className="mb-3 font-serif text-xl font-bold text-[#20392c]">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
