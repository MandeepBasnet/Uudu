// src/pages/Events.jsx
import React from "react";

export default function Events() {
  // Later, events could be fetched from a CMS / API
  const events = [
    {
      id: 1,
      title: "Grand Opening Night",
      date: "September 15, 2025",
      description:
        "Celebrate the launch of UUDU in Cypress Square with live music, free samples, and ramen hacks galore.",
      image: "/images/grand-opening.jpg",
    },
    {
      id: 2,
      title: "Hack the Broth Workshop",
      date: "October 5, 2025",
      description:
        "Join our chefs to experiment with toppings and sauces. Learn fearless combinations and take home your hack kit.",
      image: "/images/broth-workshop.jpg",
    },
    {
      id: 3,
      title: "UUDU Karaoke Nights",
      date: "Every Friday",
      description:
        "Grab your bowl and sing your heart out. Food, friends, and fearless fun under one roof.",
      image: "/images/karaoke-night.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-24 md:pt-24 pb-20">
      {/* Hero */}
      <div className="relative h-60 w-full">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1
            className="text-3xl sm:text-4xl font-semibold text-white text-center"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            Events at UUDU
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div className="mx-auto max-w-4xl px-4 mt-8 text-center">
        <p className="text-gray-700 text-lg leading-relaxed text-justify">
          UUDU isn’t just about ramen – it’s about community. From workshops and
          launch parties to late-night karaoke, our events bring fearless
          foodies together. Check out what’s happening at our mothership.
        </p>
      </div>

      {/* Event Grid */}
      <div className="mx-auto max-w-6xl px-4 mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-6">
              <h2
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                {event.title}
              </h2>
              <p className="text-sm text-gray-500 mb-3">{event.date}</p>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed text-justify">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
