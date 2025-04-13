import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useDragScroll from "../../hooks/useDragScroll";
import noImage from "/noImage.jpeg";

const HorizontalCard = ({ trending }) => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Use our custom drag scroll hook
  const { ref: scrollRef } = useDragScroll();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Only show buttons if there's enough content to scroll
      const canScroll = scrollWidth > clientWidth;
      setShowLeftButton(canScroll && scrollLeft > 0);
      setShowRightButton(
        canScroll && scrollLeft < scrollWidth - clientWidth - 5
      );
    }
  };

  useEffect(() => {
    checkScroll();
  }, [trending]);

  useEffect(() => {
    const handleScroll = () => checkScroll();
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Calculate scroll amount based on container width for better responsiveness
      const scrollAmount = current.clientWidth * 0.5; // Scroll 50% of the visible width for smoother scrolling
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 100);
    }
  };

  return (
    <div className="w-full h-auto p-3 sm:p-4 md:p-6 relative mt-2 sm:mt-3">
      <div className="mb-2 sm:mb-4"></div>

      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#6556CD]/80 hover:bg-[#6556CD] text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
        >
          <i className="ri-arrow-left-s-line text-xl sm:text-2xl"></i>
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-2 sm:space-x-4 scroll-smooth py-2 horizontal-scroll"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#6556cd #2c2c2c" }}
      >
        {trending?.map((item, index) => {
          const mediaType = item.media_type || "";
          let detailsPath;
          let iconType;
          let iconColor;

          if (mediaType === "movie") {
            detailsPath = `/movies/details/${item.id}`;
            iconType = "ri-movie-2-fill";
            iconColor = "text-red-400";
          } else if (mediaType === "tv") {
            detailsPath = `/tv-shows/details/${item.id}`;
            iconType = "ri-tv-2-fill";
            iconColor = "text-blue-400";
          } else if (mediaType === "person") {
            detailsPath = `/peoples/details/${item.id}`;
            iconType = "ri-user-fill";
            iconColor = "text-green-400";
          } else {
            // Default fallback
            detailsPath = `/movies/details/${item.id}`;
            iconType = "ri-film-fill";
            iconColor = "text-purple-400";
          }

          return (
            <Link
              key={index}
              to={detailsPath}
              className="group select-none"
              style={{
                transform: "none",
                backfaceVisibility: "hidden",
                touchAction: "manipulation",
              }}
            >
              <div
                className="relative w-[140px] min-w-[140px] sm:w-[160px] sm:min-w-[160px] md:w-[180px] md:min-w-[180px] h-[250px] sm:h-[280px] md:h-[320px] rounded-lg overflow-hidden bg-zinc-800 shadow-lg transition-all duration-300 hover:shadow-xl select-none"
                style={{
                  transform: "none",
                  backfaceVisibility: "hidden",
                  touchAction: "manipulation",
                }}
              >
                <img
                  src={
                    item.poster_path || item.backdrop_path || item.profile_path
                      ? `https://image.tmdb.org/t/p/w500${
                          item.poster_path ||
                          item.profile_path ||
                          item.backdrop_path
                        }`
                      : noImage
                  }
                  alt={
                    item.title ||
                    item.name ||
                    item.original_title ||
                    item.original_name
                  }
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-2 sm:p-3 md:p-4">
                  <h2 className="text-xs sm:text-sm md:text-base font-semibold text-white truncate">
                    {item.title ||
                      item.name ||
                      item.original_title ||
                      item.original_name}
                  </h2>
                  <div className="flex items-center select-none space-x-1 mt-1">
                    <i
                      className={`${iconType} text-xs sm:text-sm ${iconColor}`}
                    ></i>
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                      {item.media_type || ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#6556CD]/80 hover:bg-[#6556CD] text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
        >
          <i className="ri-arrow-right-s-line text-xl sm:text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default HorizontalCard;
