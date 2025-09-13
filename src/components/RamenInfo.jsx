// src/components/RamenInfo.jsx
import React, { useRef, useState } from "react";

export default function RamenInfo({ product, onBack }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Function to render spiciness with fire emojis (match ToppingsInfo style)
  const renderSpiciness = (spiciness) => {
    if (!spiciness) return null;

    const match = spiciness.match(/(\d+)\s*out\s*of\s*10\s*flames?/i);
    if (match) {
      const count = parseInt(match[1]);
      const fireEmojis = "🔥".repeat(count);
      return (
        <div className="flex items-center gap-2">
          <span className="text-2xl">{fireEmojis}</span>
          <span className="text-gray-500 text-xs">({count}/10)</span>
        </div>
      );
    }

    return <p className="text-red-500 font-medium text-sm">{spiciness}</p>;
  };

  // Ref and handlers to make desktop horizontal scrolling reliable
  const horizontalScrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const handleWheel = (e) => {
    const container = horizontalScrollRef.current;
    if (!container) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  };
  const handleMouseDown = (e) => {
    const container = horizontalScrollRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX - container.offsetLeft;
    scrollStartLeftRef.current = container.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };
  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };
  const handleMouseMove = (e) => {
    const container = horizontalScrollRef.current;
    if (!container || !isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1;
    container.scrollLeft = scrollStartLeftRef.current - walk;
  };

  if (!product) return null;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm overflow-hidden">
          <img
            src={
              product.image_url
                ? `/images/${product.image_url}`
                : "/images/placeholder.jpg"
            }
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3
            className="text-xl font-semibold text-gray-800"
            style={{
              fontFamily: "Bahnschrift, system-ui, sans-serif",
            }}
          >
            {product.name}
          </h3>
          <p className="text-[#C84E00] font-medium">
            ${product.price || product.price_packet}
          </p>
        </div>
      </div>

      {product.description && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {product.spiciness && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Spiciness</h4>
          {renderSpiciness(product.spiciness)}
        </div>
      )}

      {/* {product.suggested_toppings && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            Suggested Toppings
          </h4>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {product.suggested_toppings}
          </div>
        </div>
      )} */}

      {product.suggested_videos && product.suggested_videos.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            Video Suggestions
          </h4>

          {/* Desktop: Horizontal scrollable slider */}
          <div className="hidden lg:block">
            <div
              ref={horizontalScrollRef}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="overflow-x-auto no-scrollbar cursor-grab select-none"
            >
              <div
                className="inline-flex whitespace-nowrap gap-4 pb-2"
                style={{ minWidth: "max-content" }}
              >
                {product.suggested_videos.map((video, index) => {
                  const videoId = getYouTubeVideoId(video.url);
                  return (
                    <div key={index} className="flex-shrink-0 w-64">
                      <div
                        className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedVideo(video)}
                      >
                        {videoId && (
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={video.description}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {video.description}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Click to watch
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile and Tablet: Vertical list */}
          <div className="lg:hidden space-y-2">
            {product.suggested_videos.map((video, index) => (
              <button
                key={index}
                onClick={() => setSelectedVideo(video)}
                className="w-full text-left block bg-white p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <span className="text-blue-600 text-sm font-medium">
                  {video.description}
                </span>
                <p className="text-xs text-gray-500 mt-1">Tap to watch</p>
              </button>
            ))}
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold text-gray-800">
                    {selectedVideo.description}
                  </h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      selectedVideo.url
                    )}`}
                    title={selectedVideo.description}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 flex gap-2">
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View on YouTube
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {product.allergen && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            Allergen Information
          </h4>
          <p className="text-gray-600 text-xs leading-relaxed bg-yellow-50 p-2 rounded">
            {product.allergen}
          </p>
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full mt-4 bg-[#C84E00] text-white py-2 px-4 rounded-lg hover:bg-[#B73E00] transition-colors"
        style={{
          fontFamily: "Bahnschrift, system-ui, sans-serif",
        }}
      >
        Back to Category Info
      </button>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          touch-action: pan-x;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
