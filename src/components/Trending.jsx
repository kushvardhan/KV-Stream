import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import ScrollToTopButton from "./ScrollToTopButton";
import Cards from "./templates/Cards";
import DropDown from "./templates/DropDown";
import Shimmer from "./templates/Shimmer";
import TopNav from "./templates/TopNav";

const Trending = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [duration, setDuration] = useState("day");
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  document.title = "KV | Trending " + category.toUpperCase();

  const getTrending = useCallback(
    async (reset = false) => {
      if (!hasMore || loading) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/trending/${
            category === "movies" ? "movie" : category
          }/${duration}?page=${page}`
        );
        if (data.results.length === 0 || page > data.total_pages) {
          setHasMore(false);
        } else {
          // Only update if we're resetting or adding new trending items
          if (reset || data.results.length > 0) {
            setTrending((prev) => {
              // If resetting, just use the new results
              if (reset) return data.results;

              // Otherwise, add new results to existing ones without duplicates
              const existingIds = new Set(prev.map((item) => item.id));
              const uniqueNewResults = data.results.filter(
                (item) => !existingIds.has(item.id)
              );

              return [...prev, ...uniqueNewResults];
            });
          }
        }
      } catch (err) {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [category, duration, page, hasMore, loading]
  );

  useEffect(() => {
    setTrending([]);
    setPage(1);
    setHasMore(true);
    getTrending(true);
  }, [category, duration]);

  // Separate effect for scroll-to-top button
  useEffect(() => {
    const handleScrollForButton = () => {
      // Show/hide scroll to top button - show after scrolling down 1+ screen page
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 1; // Just 1 screen height for better visibility
      const shouldShow = window.scrollY > scrollThreshold;

      // Force show the button if we have more than 1 page of content
      if (trending.length > 20) {
        setShowTopButton(true);
        return;
      }

      // Only log in development
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Trending - Scroll position for button:",
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
  }, [trending.length]);

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
            console.log("Loading more trending content...", {
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
      if (trending.length < 10 && !loading && hasMore) {
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
  }, [loading, hasMore, category, page, trending.length]);

  useEffect(() => {
    if (page > 1) getTrending();
  }, [page, getTrending]);

  // This function is no longer needed as we're using the ScrollToTopButton component
  // which has its own scrollToTop function

  return (
    <div className="pt-[14vh] pb-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-300 text-2xl flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-[#a69ddb] hover:shadow-[0_0_10px_#6556CD] transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          Trending{" "}
          <small className="text-sm select-none text-zinc-600">
            ({category})
          </small>
        </h1>
      </div>

      <div className="w-full mb-6 px-4 sm:px-6">
        <TopNav />
      </div>

      <div className="w-full flex flex-wrap items-center  mb-6 px-4 sm:px-6">
        <DropDown
          title="Category"
          options={["movie", "tv", "all"]}
          func={setCategory}
        />
        <DropDown
          title="Duration"
          options={["day", "week"]}
          func={setDuration}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-6">
        {trending.length === 0 && loading ? (
          <Shimmer />
        ) : (
          trending.map((item) => (
            <Cards key={item.id} data={item} title={category} />
          ))
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-zinc-300">
          <i className="ri-loader-4-line animate-spin text-xl"></i> Loading
          more...
        </div>
      )}

      {/* Use the new ScrollToTopButton component */}
      <ScrollToTopButton show={showTopButton} color="primary" />
    </div>
  );
};

export default Trending;
