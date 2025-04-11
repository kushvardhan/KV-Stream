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

    // Improved scroll handler for better infinite scrolling
    const handleScroll = () => {
      // Don't do anything if already loading or no more content
      if (loading || !hasMore || isLoadingMore) return;

      // Get scroll position - simpler calculation
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Calculate distance from bottom in pixels
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      console.log(`Popular - Distance from bottom: ${distanceFromBottom}px`);

      // Load more when within 300px of the bottom
      if (distanceFromBottom < 300) {
        isLoadingMore = true;

        // Use a short timeout to prevent multiple calls
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log("Loading more popular content...", {
            category,
            page: page + 1,
          });
          setPage((prevPage) => prevPage + 1);

          // Reset the flag after a longer delay to prevent multiple triggers
          setTimeout(() => {
            isLoadingMore = false;
          }, 1000);
        }, 100);
      }
    };

    // Add scroll event listener
    if (process.env.NODE_ENV !== "production") {
      console.log("Adding scroll event listener");
    }
    window.addEventListener("scroll", handleScroll);

    // Check if we need to load more content initially
    setTimeout(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      // If content doesn't fill the page, load more
      if (documentHeight <= windowHeight * 1.2 && !loading && hasMore) {
        console.log("Popular - Content does not fill page, loading more...");
        setPage((prevPage) => prevPage + 1);
      }
    }, 500);

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
    <div className="pt-4 pb-4 w-screen min-h-screen bg-[#25262B] flex flex-col overflow-x-hidden scroll-container">
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

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-6 sm:px-8">
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
