import React from "react";

export default function Section({ title, content, img, imageLeft }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2">
        <div className={`${imageLeft ? "md:order-2" : ""}`}>
          <img
            src={img}
            alt={title}
            className="w-full rounded-3xl object-cover shadow-sm"
          />
        </div>
        <div className={`${imageLeft ? "md:order-1" : ""}`}>
          <h2
            className="text-2xl sm:text-3xl font-semibold"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            {title}
          </h2>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </section>
  );
}
