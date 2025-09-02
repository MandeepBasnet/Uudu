// src/pages/Menu/MenuMain.jsx
import React from "react";
import { Link } from "react-router-dom";
import MenuCategoryCard from "../../components/MenuCategoryCard";

const categories = [
  {
    name: "S. Korea",
    slug: "korea",
    image: "/images/categories/korea.jpg",
  },
  {
    name: "Japan",
    slug: "japan",
    image: "/images/categories/japan.jpg",
  },
  {
    name: "Taiwan",
    slug: "taiwan",
    image: "/images/categories/taiwan.jpg",
  },
  {
    name: "Other Asia",
    slug: "other-asia",
    image: "/images/categories/other-asia.jpg",
  },
  {
    name: "Toppers",
    slug: "toppers",
    image: "/images/categories/toppers.jpg",
  },
  {
    name: "Bévs",
    slug: "bevs",
    image: "/images/categories/bevs.jpg",
  },
  {
    name: "Snax",
    slug: "snax",
    image: "/images/categories/snax.jpg",
  },
  {
    name: "Specials",
    slug: "specials",
    image: "/images/categories/specials.jpg",
  },
];

export default function MenuMain() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <h1
          className="text-3xl sm:text-4xl font-semibold mb-10 text-center"
          style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
        >
          Explore the Menu
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/menu/${cat.slug}`}>
              <MenuCategoryCard name={cat.name} image={cat.image} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
