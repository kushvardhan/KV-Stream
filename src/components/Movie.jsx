import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import ScrollToTopButton from "./ScrollToTopButton";
import Cards from "./templates/Cards";
import DropDown from "./templates/DropDown";
import Shimmer from "./templates/Shimmer";
import TopNav from "./templates/TopNav";

const Movie = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("popular");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  document.title = "KV | Movies";

  const getMovies = async (
    reset = false,
    selectedCategory = category,
    selectedPage = page
  ) => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.get(
        `/movie/${selectedCategory}?page=${selectedPage}`
      );
      const results = data.results || [];

      // Only update if we're resetting or adding new movies
      if (reset || results.length > 0) {
        setMovies((prev) => {
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
    setMovies([]);
    setPage(1);
    setHasMore(true);
    getMovies(true, category, 1);
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      getMovies(false, category, page);
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
      if (movies.length > 20) {
        setShowTopButton(true);
        return;
      }

      // Only log in development
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Scroll position for button:",
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
  }, [movies.length]);

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
            console.log("Loading more movies...", {
              scrollPosition,
              scrollThreshold,
              currentPage: page,
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
      if (movies.length < 10 && !loading && hasMore) {
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
  }, [loading, hasMore, page, movies.length]);

  // Debug log for page changes
  useEffect(() => {
    console.log(`Page changed to ${page}`);
  }, [page]);

  // This function is no longer needed as we're using the ScrollToTopButton component
  // which has its own scrollToTop function

  return (
    <div className="pt-[14vh] pb-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-300 text-2xl flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-green-500 hover:shadow-[0_0_10px_#22c55e] transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          Movies{" "}
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
          options={["popular", "top_rated", "upcoming", "now_playing"]}
          func={setCategory}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-6">
        {movies.length === 0 && loading ? (
          <Shimmer />
        ) : (
          movies.map((movie) => (
            <Cards key={movie.id} data={movie} title="movie" />
          ))
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-green-300">
          <i className="ri-loader-4-line animate-spin text-xl"></i> Loading
          more...
        </div>
      )}

      {!hasMore && movies.length > 0 && (
        <div className="text-center py-4 text-zinc-400">
          No more movies to load
        </div>
      )}

      {/* Use the new ScrollToTopButton component */}
      <ScrollToTopButton show={showTopButton} color="primary" />
    </div>
  );
};

export default Movie;
