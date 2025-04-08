import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SideNav = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and update state
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobile &&
        isOpen &&
        !e.target.closest(".sidebar-container") &&
        !e.target.closest(".hamburger-button")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen]);

  // Toggle body scroll when mobile menu is open and notify parent component
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }

    // Notify parent component about sidebar state
    if (onToggle) {
      onToggle(isOpen);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isMobile, onToggle]);

  return (
    <>
      {/* Mobile hamburger menu */}
      {isMobile && (
        <button
          onClick={() => {
            const newState = !isOpen;
            setIsOpen(newState);
            if (onToggle) onToggle(newState);
          }}
          className={`hamburger-button fixed top-4 ${
            isOpen ? "right-4" : "left-4"
          } z-[110] p-2 rounded-md bg-[#1F1E24] text-white shadow-md focus:outline-none md:hidden transition-all duration-300`}
          aria-label="Toggle menu"
        >
          <i className={`ri-${isOpen ? "close" : "menu"}-line text-xl`}></i>
        </button>
      )}

      {/* Sidebar - different styles for mobile vs desktop */}
      <div
        className={`sidebar-container ${
          isMobile
            ? "fixed inset-y-0 left-0 z-[100] w-[75%] xs:w-[60%] sm:w-[50%] md:w-[40%]"
            : "w-full md:w-[20%] lg:w-[18%] xl:w-[15%]"
        } h-full border-r border-zinc-400 py-8 px-4 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600 transition-all duration-300 bg-[#1F1E24] ${
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""
        }`}
      >
        <h1 className="flex items-center px-3 select-none mt-4 md:mt-0">
          <i className="ri-tv-fill text-[#6556CD] text-center text-4xl"></i>
          <span className="text-3xl text-center font-bold ml-2 tracking-wide">
            KV.
          </span>
        </h1>

        <nav className="flex flex-col">
          <h1 className="text-xl md:text-2xl mt-8 mb-5 font-bold text-zinc-200 font-gilroy px-3">
            New Feeds
          </h1>
          <div className="text-md font-sans tracking-wide flex flex-col gap-2 text-zinc-300 ml-2 select-none">
            <Link
              to="/trending"
              className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2"
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                  if (onToggle) onToggle(false);
                }
              }}
            >
              <i className="ri-fire-fill text-xl mr-1"></i> Trending
            </Link>
            <Link
              to="/popular"
              className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2"
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                  if (onToggle) onToggle(false);
                }
              }}
            >
              <i className="ri-bard-fill text-xl mr-1"></i> Popular
            </Link>
            <Link
              to="/movies"
              className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2"
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                  if (onToggle) onToggle(false);
                }
              }}
            >
              <i className="ri-movie-2-fill text-xl mr-1"></i> Movies
            </Link>
            <Link
              to="/tv-shows"
              className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2"
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                  if (onToggle) onToggle(false);
                }
              }}
            >
              <i className="ri-slideshow-3-fill text-xl mr-1"></i> TV Shows
            </Link>
            <Link
              to="/peoples"
              className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2"
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                  if (onToggle) onToggle(false);
                }
              }}
            >
              <i className="ri-team-fill text-xl mr-1"></i> Peoples
            </Link>
          </div>
        </nav>

        <hr className="my-6 border-zinc-500" />

        <nav className="flex flex-col">
          <h1 className="text-xl md:text-2xl mb-5 font-bold text-zinc-200 font-gilroy px-3">
            Web Info
          </h1>
          <div className="text-md font-sans tracking-wide flex flex-col gap-2 text-zinc-300 ml-2 select-none">
            <Link
              to="/about-us"
              className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2"
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                  if (onToggle) onToggle(false);
                }
              }}
            >
              <i className="ri-file-info-fill text-xl mr-1"></i> About{" "}
              <span className="font-semibold">KV</span>
            </Link>
            <Link
              to="/contact-us"
              className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2"
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                  if (onToggle) onToggle(false);
                }
              }}
            >
              <i className="ri-phone-fill text-xl mr-1"></i> Contact Us
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-[90] backdrop-blur-[1px]"
          onClick={() => {
            setIsOpen(false);
            if (onToggle) onToggle(false);
          }}
        ></div>
      )}
    </>
  );
};

export default SideNav;
