import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Cards from "./templates/Cards";
import DropDown from "./templates/DropDown";
import Shimmer from "./templates/Shimmer";
import TopNav from "./templates/TopNav";

const Movie = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const [category, setCategory] = useState("popular");

  document.title = "KV | Movies ";

  const getMovies = async (
    reset = false,
    selectedCategory = category,
    selectedPage = page
  ) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { data } = await axios.get(
        `/movie/${selectedCategory}?page=${selectedPage}`
      );
      const results = data.results || [];

      setMovies((prev) => {
        const newData = reset ? results : [...prev, ...results];
        return Array.from(
          new Map(newData.map((item) => [item.id, item])).values()
        );
      });

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
      // Show/hide scroll to top button - show after scrolling down 3+ screen pages
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 3; // 3 screen heights
      const shouldShow = window.scrollY > scrollThreshold;

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
  }, []);

  // Effect for infinite scrolling
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      // Infinite scroll functionality
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.body.offsetHeight - 300; // More aggressive threshold

      if (scrollPosition >= scrollThreshold) {
        if (!loading && hasMore) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            console.log("Loading more movies...", {
              scrollPosition,
              scrollThreshold,
            });
            setPage((prevPage) => prevPage + 1);
          }, 200);
        }
      }
    };

    // Add scroll event listener
    console.log("Adding scroll event listener");
    window.addEventListener("scroll", handleScroll);

    // Initial check in case the page is not tall enough
    setTimeout(() => {
      handleScroll();
    }, 500);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
      console.log("Removed scroll event listener");
    };
  }, [loading, hasMore]);

  // Debug log for page changes
  useEffect(() => {
    console.log(`Page changed to ${page}`);
  }, [page]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-[12vh] pb-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-400 text-2xl flex items-center gap-3 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-green-500 hover:shadow-[0_0_10px_#32CD32] transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
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
          func={(selected) => {
            setCategory(selected);
            setMovies([]);
            setPage(1);
            setHasMore(true);
            getMovies(true, selected, 1);
          }}
        />
      </div>

      <div className="flex flex-wrap justify-center items-stretch gap-6 px-4 sm:px-6 w-full">
        {movies.length === 0 && loading ? (
          <Shimmer />
        ) : (
          movies.map((item) => (
            <Cards
              key={item.id}
              data={item}
              category="movie"
              hideDetails={false}
            />
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

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:from-green-600 hover:to-indigo-700 transition-all duration-300 z-50 group hover:scale-110"
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
      )}
    </div>
  );
};

export default Movie;
