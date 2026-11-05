
"use client";

import Link from "next/link";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    kicker: "Stories worth sharing",
    title: "Find the book that stays with you.",
    description:
      "Browse a growing community shelf and borrow your next unforgettable read.",
    className: "hero-slide-one",
  },
  {
    kicker: "New worlds, close by",
    title: "Curiosity belongs on every shelf.",
    description:
      "Move from science to history, fiction to childhood favorites, all in one welcoming nook.",
    className: "hero-slide-two",
  },
  {
    kicker: "A library built together",
    title: "Share a favorite. Start a journey.",
    description:
      "Add books you love and help another reader find exactly the story they needed.",
    className: "hero-slide-three",
  },
];

export function HomeHero() {
  return (
    <section className="hero-shell" aria-label="BookNook highlights">
      <Swiper
        modules={[Autoplay, Keyboard, Pagination]}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className={`hero-slide ${slide.className}`}>
              <div className="site-container booknook-hero-content">
                <p>{slide.kicker}</p>
                <h1>{slide.title}</h1>
                <span>{slide.description}</span>

                <Link className="button hero-button" href="/books">
                  Browse books
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
