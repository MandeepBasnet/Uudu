import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Section from "../components/Section";

/**
 * UUDU — Home Page (Slide 8 Corrected Flow)
 * Tech: React (Vite, JS + SWC), Tailwind v4.1
 * Following presentation strictly:
 * - Hero full image with overlay text: "UUDU. Fearless Ramen Hack"
 * - Next section: "The ramen hack mothership has landed" with description paragraph
 * - Then: "So hackin' easy", "Value beyond the hype", "Chilled vibe…", "Takeout, re‑imagined", "Cook preview".
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#3E3E3E]">
      <Navbar />
      <Hero />
      <Mothership />
      <SoHackinEasy />
      <ValueBeyondHype />
      <ChilledVibe />
      <TakeoutReimagined />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative h-[90vh] min-h-[520px] w-full">
            <img
              src="/images/hero-desktop.jpg"
              alt="Hero ramen"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1
                className="text-3xl sm:text-6xl font-semibold text-white"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                UUDU. Fearless Ramen Hack
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mothership() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2
          className="text-2xl sm:text-4xl font-semibold"
          style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
        >
          The ramen hack mothership has landed
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed">
          From edgy food joints across South Korea and all over Asia, the
          self‑serve ramen craze has officially landed in the U.S. At UUDU,
          we're the intuitive launchpad for creative "hackers" to craft their
          unique bowl with ease. Grab your instant nuudu, pick your toppings of
          choice, reinvent that killer broth. It's all about fast, fun, and
          flavor… fearlessly your way!
        </p>
      </div>
    </section>
  );
}

function SoHackinEasy() {
  return (
    <Section
      title="So hackin' easy"
      content="Instant ramen fans take their bowls beyond the basic packet. UUDU stocks 28 toppings and bold hack sauces with step‑by‑step visuals, pairings, and techniques so hacking feels straightforward."
      img="/images/easy-desktop.jpg"
    />
  );
}

function ValueBeyondHype() {
  return (
    <Section
      title="Value beyond the hype"
      content="32 ramen packets + 28 toppings = endless combos. We make it simple with clear visuals and pairings so your bowl always delivers value and taste."
      img="/images/value-desktop.jpg"
      imageLeft
    />
  );
}

function ChilledVibe() {
  return (
    <Section
      title="Chilled vibe for a new foodie generation"
      content="With subtle ambiance, spacious seating, and curated entertainment, UUDU is the place to vibe, try new foods, and share bold flavors."
      img="/images/vibe-desktop.jpg"
    />
  );
}

function TakeoutReimagined() {
  return (
    <Section
      title="Takeout, re‑imagined"
      content="Break the boring cycle with ramen kits, pre‑packed for grab‑and‑go or delivery. Quick, craveable, and fun for family dinners too."
      img="/images/takeout-desktop.jpg"
      imageLeft
    />
  );
}
