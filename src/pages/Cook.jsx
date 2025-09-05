// src/pages/Cook.jsx
import React from "react";

export default function Cook() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
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
      <div className="mx-auto max-w-6xl px-4 mt-12">
        {/* Intro */}
        <p className="text-center text-gray-700 text-lg mb-10 leading-relaxed">
          Follow these simple steps to prepare your perfect bowl of ramen. Fast,
          fun, and fearless – just how Uudu likes it.
        </p>

        {/* Two-column layout: Video + Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Video */}
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

          {/* Right: Steps */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              Step-by-Step
            </h2>
            <ol className="list-decimal pl-5 space-y-4 text-gray-700 leading-relaxed">
              <li>Add noodles & seasoning to the cooker bowl.</li>
              <li>
                Select <strong>Menu 1</strong> (460 ml water; 280 seconds).
              </li>
              <li>Stir noodles during the cooking process.</li>
              <li>
                Add toppings during the final 60 seconds if you want that
                perfect hack.
              </li>
              <li>Carefully remove bowl, stir, and enjoy fearlessly!</li>
            </ol>
          </div>
        </div>

        {/* Tips & Safety */}
        <div className="mt-10 bg-[#FFF4ED] border-l-4 border-[#C84E00] p-6 rounded-2xl">
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
    </div>
  );
}
