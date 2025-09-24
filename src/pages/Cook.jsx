// src/pages/Cook.jsx
import React from "react";
import NoodleInstructions from "../components/NoodleInstructions";

export default function Cook() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-24 md:pt-24">
      {/* Hero */}
      <div className="relative h-60 w-full">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1
            className="text-3xl sm:text-4xl font-semibold text-white text-center"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            Cook your ramen, the Uudu way
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-8">
        {/* Intro */}
        <p className="text-center text-gray-700 text-lg mb-10 leading-relaxed">
          Follow these simple steps to prepare your perfect bowl of ramen. Fast,
          fun, and fearless – just how Uudu likes it.
        </p>

        {/* Two-column layout: Video + Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Video with Pro Tips below */}
          <div className="flex flex-col gap-6">
            <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-sm">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/efXXkKFUe5M?start=3"
                title="Uudu Cooking Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="bg-[#FFF4ED] border-l-4 border-[#C84E00] p-6 rounded-2xl">
              <h3
                className="text-xl font-semibold mb-2 text-[#C84E00]"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                Pro Tips & Safety
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>Handle the cooker bowl carefully – it will be hot.</li>
                <li>Experiment with sauces and toppings to create your hack.</li>
                <li>Don’t overcrowd – keep broth-to-noodle ratio balanced.</li>
                <li>Always stir well before serving.</li>
              </ul>
            </div>
          </div>

          {/* Right: Noodle Instructions */}
          <NoodleInstructions />
        </div>
      </div>
    </div>
  );
}
