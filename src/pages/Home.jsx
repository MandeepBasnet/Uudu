"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

/**
 * UUDU – Home Page
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0E6DE] text-[#99564c]">
      <Navbar />
      <Hero />
      <div className="hidden md:block">
        <AnimatedSections />
      </div>
      <div className="md:hidden">
        <Mothership />
        <SoHackinEasy />
        <ValueBeyondHype />
        <ChilledVibe />
        <TakeoutReimagined />
      </div>
    </div>
  );
}

function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [showUudu, setShowUudu] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Show "Uudu." first
    const uuduTimer = setTimeout(() => {
      setShowUudu(true);
    }, 300);

    // Show "Fearless Ramen Hack" after "Uudu." has faded in
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1500);

    return () => {
      clearTimeout(uuduTimer);
      clearTimeout(taglineTimer);
    };
  }, []);

  // Calculate transition based on scroll position (transition starts after 100px scroll)
  const transitionProgress = Math.min(scrollY / 300, 1);

  return (
    <section className="pt-24 sm:pt-28">
      <div className="relative h-[90vh] min-h-[520px] w-full overflow-hidden">
        <img
          src="/images/hero-desktop.png"
          alt="Hero ramen black and white"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: 1 - transitionProgress,
            transition: "opacity 0.3s ease-out",
          }}
        />
        <img
          src="/images/hero-desktop-color.png"
          alt="Hero ramen color"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: transitionProgress,
            transition: "opacity 0.3s ease-out",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1
            className="text-3xl sm:text-6xl font-semibold text-[#C84E00] mb-4"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            <span
              style={{
                opacity: showUudu ? 1 : 0,
                transition: "opacity 0.8s ease-in-out",
              }}
            >
              Uudu.{" "}
            </span>
            <span
              style={{
                opacity: showTagline ? 1 : 0,
                transition: "opacity 0.8s ease-in-out",
              }}
            >
              Fearless Ramen Hack
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}

function Mothership() {
  return (
    <section className="py-12 sm:py-16 bg-[#F0E6DE]">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          <div className="md:col-span-4 lg:col-span-4">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#374d64] mb-6"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              The ramen hack mothership has landed . . .
            </h2>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              From edgy food joints across South Korea and all over Asia, the
              self-serve ramen craze has officially landed in the U.S. At UUDU,
              we're the intuitive launchpad for creative "hackers" to craft
              their unique bowl with ease. Grab your instant nuudu, pick your
              toppings of choice, reinvent that killer broth.
            </p>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              It's all about fast, fun, and flavor... fearlessly your way!
            </p>
          </div>
          <div className="md:col-span-8 lg:col-span-8 mt-6 md:mt-0">
            <img
              src="/images/mothership-desktop.png"
              alt="The ramen hack mothership has landed"
              className="w-full h-[500px] sm:h-[580px] md:h-[650px] lg:h-[720px] rounded-3xl object-cover shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SoHackinEasy() {
  return (
    <section className="py-12 sm:py-16 bg-[#E6D7FF]">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          <div className="md:col-span-8 lg:col-span-8 mb-6 md:mb-0">
            <img
              src="/images/easy-desktop.png"
              alt="So hackin' easy"
              className="w-full h-[580px] sm:h-[660px] md:h-[720px] lg:h-[800px] rounded-3xl object-cover shadow-sm"
            />
          </div>
          <div className="md:col-span-4 lg:col-span-4">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#374d64] mb-6"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              So hackin' easy
            </h2>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              Scroll through social and you'll see it—instant ramen fans taking
              their bowls to the next level, far beyond the basic packet. That
              kind of flavor magic and hack-level fun takes more than noodles
              alone, which is why UUDU stocks 28 unique toppings and bold hack
              sauces to make any instant ramen—Korean, Japanese, or
              otherwise—taste incredible… even out of this world.
            </p>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              And no sweat on your next amazing nuudu creation. At UUDU, we
              break it all down with step-by-step visuals, smart pairings, and
              fail-safe techniques so hacking feels straightforward, not
              overwhelming. <em>Now</em>, the possibilities are truly endless.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueBeyondHype() {
  return (
    <section className="py-12 sm:py-16 bg-[#D4F4DD]">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          <div className="md:col-span-4 lg:col-span-4 md:order-1">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#374d64] mb-6"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              Value beyond
              <br />
              The hype
            </h2>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              Self-serve ramen can be euphoric, but it shouldn't feel
              overpriced. UUDU keeps the experience <em>real</em> with a
              commitment to pricing below market while delivering a more
              satisfying, value-driven hack adventure.
            </p>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              It's about building a long-term connection with our customers
              through a sensible '<strong>right portion, right price</strong>'
              approach. No hype. No waste. No upsell. Just the total freedom to
              explore this exciting new foodie frontier. Check out our menu to
              see how we make fearless flavor hacking affordable and fun.
            </p>
            <a
              href="/menu"
              className="inline-block mt-4 bg-[#99564c] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#99564c]/80 transition-colors"
            >
              MENU
            </a>
          </div>
          <div className="md:col-span-8 lg:col-span-8 md:order-2 mt-6 md:mt-0">
            <img
              src="/images/value-desktop.png"
              alt="Value beyond the hype"
              className="w-full h-[520px] sm:h-[600px] md:h-[680px] lg:h-[740px] rounded-3xl object-cover shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChilledVibe() {
  return (
    <section className="py-12 sm:py-16 bg-[#D1E7FF]">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          <div className="md:col-span-8 lg:col-span-8 mb-6 md:mb-0">
            <img
              src="/images/vibe-desktop.png"
              alt="Chilled vibe for a new foodie generation"
              className="w-full h-[520px] sm:h-[600px] md:h-[680px] lg:h-[740px] rounded-3xl object-cover shadow-sm"
            />
          </div>
          <div className="md:col-span-4 lg:col-span-4">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#374d64] mb-6"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              Chilled vibe for a new foodie generation
            </h2>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              UUDU isn't just a resourceful nuudu hack lab—it's where you vibe.
              With an inviting, subtle ambiance, spacious seating, and curated
              socialtainment playing on the big screen, we've built a space
              where casual creatives can chill and try new foods.
            </p>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              There's an uncommon rhythm and spirit that you'll feel right away,
              echoing the range of our global flavors. UUDU brings people
              together over bold tastes, fresh ideas, and a love for doing
              things differently. Who knows how this self-serve ramen trend will
              unfold—but together, WE will help shape the next chapter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TakeoutReimagined() {
  return (
    <section className="py-12 sm:py-16 bg-[#FFE1F0]">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          <div className="md:col-span-4 lg:col-span-4 md:order-1">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#374d64] mb-6"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              Takeout, re-imagined
            </h2>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              Boring burgers and flimsy salads again at the cubicle? Break the
              cycle with one of UUDU's popular ramen kits, conveniently
              pre-packed for easy grab-and-go—or have it delivered straight to
              your office. It's a quick, craveable upgrade to your usual lunch
              routine—easy to prep, hard to beat.
            </p>
            <p className="mt-3 text-[20px] lg:text-[25px] leading-relaxed text-[#374d64] text-justify">
              And when the workday's finally over, our ramen kits can also bring
              that convenience home. For busy moms and professionals alike, UUDU
              offers a hearty, satisfying meal that's ready in minutes and costs
              less than most takeout. Better yet, kids love customizing their
              own bowls—turning dinnertime into a festive, self-serve treat.
            </p>
          </div>
          <div className="md:col-span-8 lg:col-span-8 md:order-2 mt-6 md:mt-0">
            <img
              src="/images/takeout-desktop.png"
              alt="Takeout, re-imagined"
              className="w-full h-[500px] sm:h-[580px] md:h-[650px] lg:h-[720px] rounded-3xl object-cover shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Desktop-only wrapper with entrance animations per section
function AnimatedSections() {
  return (
    <>
      <section className="md:animate-fade-in-up">
        <Mothership />
      </section>
      <section className="md:animate-fade-in-up anim-delay-100">
        <SoHackinEasy />
      </section>
      <section className="md:animate-fade-in-up anim-delay-200">
        <ValueBeyondHype />
      </section>
      <section className="md:animate-fade-in-up anim-delay-300">
        <ChilledVibe />
      </section>
      <section className="md:animate-fade-in-up anim-delay-300">
        <TakeoutReimagined />
      </section>
    </>
  );
}
