import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import ScrollToTopButton from "./ScrollToTopButton";
import Cards from "./templates/Cards";
import Shimmer from "./templates/Shimmer";
import TopNav from "./templates/TopNav";

const People = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  document.title = "KV | People";

  const getPeople = async (reset = false, selectedPage = page) => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.get(`/person/popular?page=${selectedPage}`);
      const results = data.results || [];
      // Only update if we're resetting or adding new people
      if (reset || results.length > 0) {
        setPeople((prev) => {
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
  };

  useEffect(() => {
    setPeople([]);
    setPage(1);
    setHasMore(true);
    getPeople(true, 1);
  }, []);

  useEffect(() => {
    if (page > 1) {
      getPeople(false, page);
    }
  }, [page]);

  // Separate effect for scroll-to-top button
  useEffect(() => {
    const handleScrollForButton = () => {
      // Show/hide scroll to top button - show after scrolling down 1+ screen page
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 1; // Just 1 screen height for better visibility
      const shouldShow = window.scrollY > scrollThreshold;

      // Force show the button if we have more than 1 page of content
      if (people.length > 20) {
        setShowTopButton(true);
        return;
      }

      // Only log in development
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "People - Scroll position for button:",
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
  }, [people.length]);

  // Effect for infinite scrolling
  useEffect(() => {
    let timeout;
    let isLoadingMore = false;

    // Optimized scroll handler with throttling
    const handleScroll = () => {
      if (isLoadingMore) return;

      isLoadingMore = true;

      // Use requestAnimationFrame for smoother performance
      window.requestAnimationFrame(() => {
        // Don't do anything if already loading or no more content
        if (loading || !hasMore) {
          isLoadingMore = false;
          return;
        }

        // Infinite scroll functionality - load when 80% down the page
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.body.offsetHeight;
        const scrollPercentage = (scrollPosition / pageHeight) * 100;

        // Load more content when user has scrolled 80% down the page
        if (scrollPercentage > 80) {
          clearTimeout(timeout);

          timeout = setTimeout(() => {
            if (process.env.NODE_ENV !== "production") {
              console.log("Loading more people...", {
                scrollPercentage,
                currentPage: page,
              });
            }

            setPage((prevPage) => prevPage + 1);
          }, 100); // Very short timeout for responsive loading
        }

        isLoadingMore = false;
      });
    };

    // Add scroll event listener
    if (process.env.NODE_ENV !== "production") {
      console.log("Adding scroll event listener");
    }
    window.addEventListener("scroll", handleScroll);

    // Initial check in case the page is not tall enough
    setTimeout(() => {
      if (people.length < 10 && !loading && hasMore) {
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
  }, [loading, hasMore, page, people.length]);

  // This function is no longer needed as we're using the ScrollToTopButton component
  // which has its own scrollToTop function

  return (
    <div className="pt-4 pb-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-300 text-2xl flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-purple-500 hover:shadow-[0_0_10px_#a855f7] transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          Popular People
        </h1>
      </div>

      <div className="w-full mb-6 px-4 sm:px-6">
        <TopNav />
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-6">
        {people.length === 0 && loading ? (
          <Shimmer />
        ) : (
          people.map((person) => (
            <Cards key={person.id} data={person} title="person" />
          ))
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-purple-300">
          <i className="ri-loader-4-line animate-spin text-xl"></i> Loading
          more...
        </div>
      )}

      {!hasMore && people.length > 0 && (
        <div className="text-center py-4 text-zinc-400">
          No more people to load
        </div>
      )}

      {/* Use the new ScrollToTopButton component */}
      <ScrollToTopButton show={showTopButton} color="indigo" />
    </div>
  );
};

export default People;
