import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Section from "../components/Section";

/**
 * UUDU – Home Page
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
              src="/images/hero-desktop.png"
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
    <section className="py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-semibold"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            The ramen hack mothership has landed . . .
          </h2>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed">
            From edgy food joints across South Korea and all over Asia, the
            self-serve ramen craze has officially landed in the U.S. At UUDU,
            we're the intuitive launchpad for creative "hackers" to craft their
            unique bowl with ease. Grab your instant nuudu, pick your toppings
            of choice, reinvent that killer broth.
          </p>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed">
            It's all about fast, fun, and flavor... fearlessly your way!
          </p>
        </div>
        <div>
          <img
            src="/images/mothership-desktop.png"
            alt="The ramen hack mothership has landed"
            className="w-full rounded-3xl object-cover shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}

function SoHackinEasy() {
  return (
    <Section
      title="So hackin' easy"
      content="Scroll through social and you’ll see it—instant ramen fans taking their bowls to the next level, far beyond the basic packet. That kind of flavor magic and hack‑level fun takes more than noodles alone, which is why UUDU stocks 28 unique toppings and bold hack sauces to make any instant ramen—Korean, Japanese, or otherwise—taste incredible… even out of this world.  <br /> <br /> And no sweat on your next amazing nuudu creation. At UUDU, we break it all down with step‑by‑step visuals, smart pairings, and fail‑safe techniques so hacking feels straightforward, not overwhelming. Now, the possibilities are truly endless."
      img="/images/easy-desktop.png"
    />
  );
}

function ValueBeyondHype() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2">
        <div className="md:order-1">
          <h2
            className="text-2xl sm:text-3xl font-semibold"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            Value beyond
            <br />
            The hype
          </h2>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed">
            Self-serve ramen can be euphoric, but it shouldn't feel overpriced.
            UUDU keeps the experience <em>real</em> with a commitment to pricing
            below market while delivering a more satisfying, value-driven hack
            adventure.
          </p>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed">
            It's about building a long-term connection with our customers
            through a sensible '<strong>right portion, right price</strong>'
            approach. No hype. No waste. No upsell. Just the total freedom to
            explore this exciting new foodie frontier. Check out our menu to see
            how we make fearless flavor hacking affordable and fun.
          </p>
          <a
            href="/menu"
            className="inline-block mt-4 bg-[#C84E00] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#B73D00] transition-colors"
          >
            MENU
          </a>
        </div>
        <div className="md:order-2">
          <img
            src="/images/value-desktop.png"
            alt="Value beyond the hype"
            className="w-full rounded-3xl object-cover shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}

function ChilledVibe() {
  return (
    <Section
      title="Chilled vibe for a new foodie generation"
      content="UUDU isn’t just a resourceful nuudu hack lab—it’s where you vibe. With an inviting, subtle ambiance, spacious seating, and curated socialtainment playing on the big screen, we’ve built a space where casual creatives can chill and try new foods. <br /> <br />There’s an uncommon rhythm and spirit that you’ll feel right away, echoing the range of our global flavors. UUDU brings people together over bold tastes, fresh ideas, and a love for doing things differently. Who knows how this self-serve ramen trend will unfold—but together, WE will help shape the next chapter.
"
      img="/images/vibe-desktop.png"
    />
  );
}

function TakeoutReimagined() {
  return (
    <Section
      title="Takeout, re‑imagined"
      content="Boring burgers and flimsy salads again at the cubicle? Break the cycle with one of UUDU's popular ramen kits, conveniently pre-packed for easy grab-and-go—or have it delivered straight to your office. It's a quick, craveable upgrade to your usual lunch routine—easy to prep, hard to beat.<br /><br />And when the workday's finally over, our ramen kits can also bring that convenience home. For busy moms and professionals alike, UUDU offers a hearty, satisfying meal that's ready in minutes and costs less than most takeout. Better yet, kids love customizing their own bowls—turning dinnertime into a festive, self-serve treat."
      img="/images/takeout-desktop.png"
      imageLeft
    />
  );
}
