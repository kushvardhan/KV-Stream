import React, { useRef, useState, useEffect } from "react";

const ScrollableSection = ({ children, title, icon }) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    // Add resize listener to check scroll when window resizes
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      return () => scrollContainer.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      // Scroll 50% of the visible width for smoother scrolling
      const scrollAmount = scrollRef.current.clientWidth * 0.5;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-8 w-[95%] p-4 bg-black/50 rounded-lg relative">
      {title && (
        <h2 className="text-lg font-semibold text-zinc-400 mb-1">
          {icon} {title}
        </h2>
      )}

      {/* Left scroll button */}
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#6556CD]/80 hover:bg-[#6556CD] text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
        >
          <i className="ri-arrow-left-s-line text-xl sm:text-2xl"></i>
        </button>
      )}

      {/* Scrollable content with visible scrollbar */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 scroll-smooth p-2 horizontal-scroll"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#6556cd #2c2c2c" }}
      >
        {children}
      </div>

      {/* Right scroll button */}
      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#6556CD]/80 hover:bg-[#6556CD] text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
        >
          <i className="ri-arrow-right-s-line text-xl sm:text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default ScrollableSection;
