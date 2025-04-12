import React, { useEffect, useRef, useState } from "react";

const HorizontalScroll = ({ children, title }) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

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
  }, [children]);

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
      // Calculate scroll amount based on container width for better responsiveness
      const scrollAmount = scrollRef.current.clientWidth * 0.5; // Scroll 50% of the visible width for smoother scrolling
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 100);
    }
  };

  return (
    <div className="w-full h-auto p-2 sm:p-3 relative mt-1">
      {title && (
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 tracking-wide px-2 sm:px-0">
          {title}
        </h1>
      )}

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
        {children}
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

export default HorizontalScroll;
