import React from "react";

/**
 * A reusable scroll-to-top button component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the button
 * @param {string} props.color - Color theme for the button (primary, orange, indigo, etc.)
 * @param {string} props.position - Position of the button (bottom-right, bottom-center, top-right, etc.)
 * @param {boolean} props.hasPagination - Whether the page has pagination
 * @param {string} props.customClass - Additional custom classes to apply
 */
const ScrollToTopButton = ({
  show,
  color = "primary",
  position = "bottom-right",
  hasPagination = false,
  customClass = "",
}) => {
  // Define gradient colors based on the theme
  const getGradient = () => {
    switch (color) {
      case "orange":
        return "from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700";
      case "indigo":
        return "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700";
      case "subtle":
        return "from-gray-600/60 to-gray-700/60 hover:from-gray-600/90 hover:to-gray-700/90";
      case "primary":
      default:
        return "from-[#6556CD]/70 to-indigo-600/70 hover:from-[#6556CD] hover:to-indigo-600";
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    // Use a more direct approach to ensure it works
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Fallback for older browsers
    setTimeout(() => {
      // If smooth scroll doesn't work, force it
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    }, 100);
  };

  if (!show) return null;

  // Determine position classes based on the position prop
  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "side-right":
        return "top-1/2 right-4 transform -translate-y-1/2";
      case "side-left":
        return "top-1/2 left-4 transform -translate-y-1/2";
      case "category-page":
        return "top-auto bottom-auto right-8"; // Position will be controlled by CSS
      case "bottom-right":
      default:
        return "bottom-4 right-4";
    }
  };

  return (
    <div
      className={`fixed ${getPositionClasses()} z-[1000] pointer-events-none ${customClass}`}
    >
      <button
        onClick={() => {
          scrollToTop();
          // Force focus away from the button to prevent keyboard issues
          document.activeElement.blur();
        }}
        className={`bg-gradient-to-r ${getGradient()} text-white p-3 rounded-full shadow-xl transition-all duration-300 group hover:scale-110 will-change-transform pointer-events-auto ${
          position === "category-page" ? "scale-110 shadow-2xl" : ""
        }`}
        style={{ transform: "translateZ(0)" }}
        aria-label="Scroll to top"
      >
        <div className="relative flex items-center justify-center">
          <i className="ri-arrow-up-line text-lg"></i>
          <span className="absolute -top-12 right-0 bg-black/80 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg transform group-hover:-translate-y-1">
            Back to top
          </span>
        </div>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
