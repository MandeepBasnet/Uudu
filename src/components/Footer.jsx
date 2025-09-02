import React from "react";

export default function Footer() {
  return (
    <footer className="pb-10 pt-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-[#C84E00]" />
              <span
                className="font-semibold tracking-wide"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                UUDU
              </span>
            </div>
            <p className="text-sm text-black/70">
              Cypress Square • 4931 Lincoln Avenue • Cypress, CA 90630 • (123)
              456-7890
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
