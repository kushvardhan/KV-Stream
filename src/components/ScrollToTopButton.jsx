import React from 'react';

/**
 * A reusable scroll-to-top button component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the button
 * @param {string} props.color - Color theme for the button (primary, orange, indigo, etc.)
 */
const ScrollToTopButton = ({ show, color = "primary" }) => {
  // Define gradient colors based on the theme
  const getGradient = () => {
    switch (color) {
      case "orange":
        return "from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700";
      case "indigo":
        return "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700";
      case "primary":
      default:
        return "from-[#6556CD] to-indigo-600 hover:from-[#7667de] hover:to-indigo-700";
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-gradient-to-r ${getGradient()} text-white p-4 rounded-full shadow-xl transition-all duration-300 z-50 group hover:scale-110`}
      aria-label="Scroll to top"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping-slow opacity-75"></span>
        <i className="ri-arrow-up-line text-xl group-hover:animate-bounce"></i>
        <span className="absolute -top-12 right-0 bg-black/80 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg transform group-hover:-translate-y-1">
          Back to top
        </span>
      </div>
    </button>
  );
};

export default ScrollToTopButton;
