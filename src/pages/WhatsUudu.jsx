// src/pages/WhatsUudu.jsx
import React from "react";

export default function WhatsUudu() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-20">
      {/* Hero */}
      <div className="relative h-60 w-full">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1
            className="text-3xl sm:text-4xl font-semibold text-white text-center"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            What’s UUDU?
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div className="mx-auto max-w-4xl px-4 mt-12 text-center">
        <p className="text-gray-700 text-lg leading-relaxed">
          UUDU is the fearless ramen hack experience. Born from the self-serve
          craze across Asia, we bring bold flavors, endless toppings, and
          intuitive cooking to the U.S. It’s fast, fun, and fearless – always
          your way.
        </p>
      </div>

      {/* Story Sections */}
      <div className="mx-auto max-w-5xl px-4 mt-16 grid gap-10">
        {/* The Idea */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2
            className="text-2xl font-semibold mb-4 text-[#C84E00]"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            The Idea
          </h2>
          <p className="text-gray-700 leading-relaxed">
            From edgy food joints in South Korea to bustling night markets
            across Asia, the ramen hack culture was born. At UUDU, we capture
            that spirit, giving everyone the tools to craft their perfect bowl.
          </p>
        </div>

        {/* The Experience */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2
            className="text-2xl font-semibold mb-4 text-[#C84E00]"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            The Experience
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Walk in, grab your instant nuudu, pick your toppings, and head to
            the mothership cooker. With step-by-step visuals, bold hack sauces,
            and chill vibes, UUDU is a launchpad for creativity.
          </p>
        </div>

        {/* The Future */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2
            className="text-2xl font-semibold mb-4 text-[#C84E00]"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            The Future
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We’re more than ramen. UUDU is a fearless food movement – from
            takeout kits and local events to a growing community of hackers
            reinventing flavor. The journey has just begun.
          </p>
        </div>
      </div>
    </div>
  );
}
