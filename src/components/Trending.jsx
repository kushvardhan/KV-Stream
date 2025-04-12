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
  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [duration, setDuration] = useState("day");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "KV | Trending";
  }, []);

  // Fetch trending content
  const getTrending = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/trending/${category}/${duration}?page=${page}`
      );

      if (data.results.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      // If page is 1, replace content, otherwise append
      if (page === 1) {
        setTrending(data.results);
      } else {
        setTrending((prevTrending) => {
          // Add new results without duplicates
          const existingIds = new Set(prevTrending.map((item) => item.id));
          const uniqueNewResults = data.results.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevTrending, ...uniqueNewResults];
        });
      }

      // Check if we have more pages
      setHasMore(page < data.total_pages);
    } catch (error) {
      console.error("Error fetching trending content:", error);
    } finally {
      setLoading(false);
    }
  }, [category, duration, page]);

  // Fetch trending content when parameters change
  useEffect(() => {
    getTrending();
  }, [category, duration, getTrending]);

  // Reset page when category or duration changes
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [category, duration]);

  // Add scroll-to-top button
  useEffect(() => {
    const handleScrollForButton = () => {
      // Show/hide scroll to top button - show after scrolling down 1+ screen page
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 1; // Just 1 screen height for better visibility
      const shouldShow = window.scrollY > scrollThreshold;

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

    // Optimized scroll handler for smoother infinite scrolling
    const handleScroll = () => {
      // Don't do anything if already loading or no more content
      if (loading || !hasMore || isLoadingMore) return;

      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        // Get scroll position - simpler calculation
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const clientHeight =
          window.innerHeight || document.documentElement.clientHeight;

        // Calculate distance from bottom in pixels
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        // Only log in development mode
        if (process.env.NODE_ENV !== "production") {
          console.log(
            `Trending - Distance from bottom: ${distanceFromBottom}px`
          );
        }

        // Load more when within 400px of the bottom (increased threshold for smoother experience)
        if (distanceFromBottom < 400) {
          isLoadingMore = true;

          // Use a short timeout to prevent multiple calls
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (process.env.NODE_ENV !== "production") {
              console.log("Loading more trending content...", {
                category,
                page: page + 1,
              });
            }
            setPage((prevPage) => prevPage + 1);

            // Reset the flag after a longer delay to prevent multiple triggers
            setTimeout(() => {
              isLoadingMore = false;
            }, 1000);
          }, 150);
        }
      });
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
        console.log("Trending - Content does not fill page, loading more...");
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
  }, [loading, hasMore, category, page, trending.length]);

  useEffect(() => {
    if (page > 1) getTrending();
  }, [page, getTrending]);

  // This function is no longer needed as we're using the ScrollToTopButton component
  // which has its own scrollToTop function

  return (
    <div className="pt-4 pb-4 w-full min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden overflow-y-auto scroll-container">
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
        <TopNav searchOnly={true} />
      </div>

      <div className="w-full flex flex-wrap items-center mb-6 px-4 sm:px-6">
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

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-0">
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
