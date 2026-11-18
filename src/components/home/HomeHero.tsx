

"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

import {
  Autoplay,
  Keyboard,
  Pagination,
  EffectFade,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    kicker: "A WORLD OF STORIES AWAITS",
    title: "Every great journey",
    highlight: "begins with a book.",
    description:
      "Discover stories that inspire, ideas that challenge, and books that stay with you long after the last page.",
    image: "hero-art-one",
    note: "Find your next chapter",
    number: "01",
  },
  {
    id: 2,
    kicker: "DISCOVER SOMETHING NEW",
    title: "A little curiosity",
    highlight: "goes a long way.",
    description:
      "From timeless fiction to fascinating discoveries, explore a growing collection made for curious minds.",
    image: "hero-art-two",
    note: "Explore our collection",
    number: "02",
  },
  {
    id: 3,
    kicker: "READ. SHARE. CONNECT.",
    title: "Good books are",
    highlight: "better when shared.",
    description:
      "Share the books you love, borrow something unexpected, and become part of a community that loves reading.",
    image: "hero-art-three",
    note: "Be part of our community",
    number: "03",
  },
];

export function HomeHero() {
  return (
    <section className="home-hero" aria-label="Welcome to BookNook">
      <div className="home-hero-inner">
        <Swiper
          modules={[Autoplay, Keyboard, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          speed={850}
          loop
          keyboard={{ enabled: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: ".hero-custom-pagination",
          }}
          className="home-hero-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="hero-panel">
                {/* Left Content */}
                <div className="hero-content">
                  <div className="hero-kicker">
                    <Sparkles size={15} />
                    <span>{slide.kicker}</span>
                  </div>

                  <h1>
                    {slide.title}
                    <span>{slide.highlight}</span>
                  </h1>

                  <p className="hero-description">
                    {slide.description}
                  </p>

                  <div className="hero-actions">
                    <Link href="/books" className="hero-primary-button">
                      Explore Books
                      <ArrowRight size={18} />
                    </Link>

                    <Link href="/register" className="hero-secondary-button">
                      Join BookNook
                    </Link>
                  </div>

                  <div className="hero-bottom-note">
                    <div className="hero-book-icon">
                      <BookOpen size={19} />
                    </div>

                    <div>
                      <strong>One book at a time.</strong>
                      <span>A little more inspiration every day.</span>
                    </div>
                  </div>
                </div>

                {/* Right Visual */}
                <div className={`hero-art ${slide.image}`}>
                  <div className="hero-art-overlay" />

                  <div className="hero-art-label">
                    <span className="hero-label-dot" />
                    <span>YOUR READING CORNER</span>
                  </div>

                  <div className="hero-floating-card">
                    <span className="hero-card-number">
                      {slide.number}
                    </span>

                    <div>
                      <strong>{slide.note}</strong>
                      <p>Open a book. Open a new world.</p>
                    </div>

                    <BookOpen size={25} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Slider Controls */}
        <div className="hero-slider-footer">
          <div className="hero-slider-caption">
            <span>BOOKNOOK</span>
            <span className="hero-caption-line" />
            <span>YOUR NEXT CHAPTER STARTS HERE</span>
          </div>

          <div className="hero-pagination-wrapper">
            <div className="hero-custom-pagination" />
          </div>
        </div>
      </div>
    </section>
  );
}
