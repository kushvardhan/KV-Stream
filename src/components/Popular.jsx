import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import ScrollToTopButton from "./ScrollToTopButton";
import Cards from "./templates/Cards";
import DropDown from "./templates/DropDown";
import Shimmer from "./templates/Shimmer";
import TopNav from "./templates/TopNav";

const Popular = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("tv");
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  document.title = "KV | Popular " + category.toUpperCase();

  const getPopular = useCallback(
    async (reset = false) => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const { data } = await axios.get(`/${category}/popular?page=${page}`);
        const results = data.results || [];

        // Only update if we're resetting or adding new popular items
        if (reset || results.length > 0) {
          setPopular((prev) => {
            // If resetting, just use the new results
            if (reset) return results;

            // Otherwise, add new results to existing ones without duplicates
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewResults = results.filter(
              (item) => !existingIds.has(item.id)
            );

            return [...prev, ...uniqueNewResults];
          });
        }

        if (results.length === 0) setHasMore(false);
      } catch (err) {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [page, category, loading, hasMore]
  );

  useEffect(() => {
    setPopular([]);
    setPage(1);
    setHasMore(true);
    getPopular(true);
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      setTimeout(() => getPopular(), 300);
    }
  }, [page, getPopular]);

  // Separate effect for scroll-to-top button
  useEffect(() => {
    const handleScrollForButton = () => {
      // Show/hide scroll to top button - show after scrolling down 1+ screen page
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 1; // Just 1 screen height for better visibility
      const shouldShow = window.scrollY > scrollThreshold;

      // Force show the button if we have more than 1 page of content
      if (popular.length > 20) {
        setShowTopButton(true);
        return;
      }

      // Only log in development
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Popular - Scroll position for button:",
          window.scrollY,
          "Threshold:",
          scrollThreshold,
          "Should show:",
          shouldShow
        );
      }

      setShowTopButton(shouldShow);
    };

    // Add scroll event listener for the button
    window.addEventListener("scroll", handleScrollForButton);

    // Initial check
    handleScrollForButton();

    return () => {
      window.removeEventListener("scroll", handleScrollForButton);
    };
  }, [popular.length]);

  // Effect for infinite scrolling
  useEffect(() => {
    let timeout;
    let isLoadingMore = false;

    const handleScroll = () => {
      // Don't do anything if already loading or no more content
      if (isLoadingMore || loading || !hasMore) return;

      // Infinite scroll functionality
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.body.offsetHeight - 300; // More aggressive threshold

      if (scrollPosition >= scrollThreshold) {
        isLoadingMore = true;
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          if (process.env.NODE_ENV !== "production") {
            console.log("Loading more popular content...", {
              scrollPosition,
              scrollThreshold,
              category,
              page,
            });
          }

          setPage((prevPage) => prevPage + 1);
          isLoadingMore = false;
        }, 500); // Increased debounce time to prevent multiple triggers
      }
    };

    // Add scroll event listener
    if (process.env.NODE_ENV !== "production") {
      console.log("Adding scroll event listener");
    }
    window.addEventListener("scroll", handleScroll);

    // Initial check in case the page is not tall enough
    setTimeout(() => {
      if (popular.length < 10 && !loading && hasMore) {
        handleScroll();
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
      if (process.env.NODE_ENV !== "production") {
        console.log("Removed scroll event listener");
      }
    };
  }, [loading, hasMore, category, page, popular.length]);

  // This function is no longer needed as we're using the ScrollToTopButton component
  // which has its own scrollToTop function

  return (
    <div className="pt-[14vh] pb-4 w-screen min-h-screen bg-[#25262B] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-400 text-2xl flex items-center gap-3 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-orange-500 hover:shadow-[0_0_10px_#FF7F50] transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          Popular{" "}
          <small className="text-sm select-none text-zinc-600">
            ({category})
          </small>
        </h1>
      </div>

      <div className="w-full mb-6 px-4 sm:px-6">
        <TopNav />
      </div>

      <div className="w-full flex flex-wrap items-center mb-6 px-4 sm:px-6">
        <DropDown
          title="Category"
          options={["tv", "movie"]}
          func={setCategory}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-6">
        {popular.length === 0 && loading ? (
          <Shimmer />
        ) : (
          popular.map((item) => (
            <Cards
              key={item.id}
              data={item}
              category={category}
              title={category}
            />
          ))
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-orange-300">
          <i className="ri-loader-4-line animate-spin text-xl"></i> Loading
          more...
        </div>
      )}

      {/* Use the new ScrollToTopButton component */}
      <ScrollToTopButton show={showTopButton} color="orange" />
    </div>
  );
};

export default Popular;
