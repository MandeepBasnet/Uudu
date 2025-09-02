// src/components/ProductCard.jsx

export default function ProductCard({ name, image, price }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <img src={image} alt={name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3
          className="text-lg font-semibold"
          style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
        >
          {name}
        </h3>
        {price && <p className="mt-1 text-sm text-gray-600">${price}</p>}
      </div>
    </div>
  );
}
