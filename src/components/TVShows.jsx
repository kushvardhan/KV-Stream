import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Cards from "./templates/Cards";
import DropDown from "./templates/DropDown";
import Shimmer from "./templates/Shimmer";
import TopNav from "./templates/TopNav";

const TVShows = () => {
  const navigate = useNavigate();
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const [category, setCategory] = useState("popular");

  document.title = "KV | TV Shows";

  const getTVShows = async (
    reset = false,
    selectedCategory = category,
    selectedPage = page
  ) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { data } = await axios.get(
        `/tv/${selectedCategory}?page=${selectedPage}`
      );
      const results = data.results || [];

      setTvShows((prev) => {
        const newData = reset ? results : [...prev, ...results];
        return Array.from(
          new Map(newData.map((item) => [item.id, item])).values()
        );
      });

      setHasMore(results.length > 0);
    } catch (err) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTvShows([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    getTVShows(true, category, page);
  }, [category, page]);

  // Separate effect for scroll-to-top button
  useEffect(() => {
    const handleScrollForButton = () => {
      // Show/hide scroll to top button - show after scrolling down 100px
      const shouldShow = window.scrollY > 100;
      console.log(
        "TV Shows - Scroll position for button:",
        window.scrollY,
        "Should show:",
        shouldShow
      );
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
            console.log("Loading more TV shows...", {
              scrollPosition,
              scrollThreshold,
            });
            setPage((prevPage) => prevPage + 1);
          }, 200);
        }
      }
    };

    // Add scroll event listener
    console.log("Adding scroll event listener for TV shows");
    window.addEventListener("scroll", handleScroll);

    // Initial check in case the page is not tall enough
    setTimeout(() => {
      handleScroll();
    }, 500);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
      console.log("Removed scroll event listener for TV shows");
    };
  }, [loading, hasMore]);

  // Debug log for page changes
  useEffect(() => {
    console.log(`TV Shows page changed to ${page}`);
  }, [page]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-[12vh] pb-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-200 text-2xl flex items-center gap-3 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-blue-300 hover:shadow-[0_0_10px_#1E90FF] transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          TV Shows{" "}
          <small className="text-sm select-none text-zinc-400">
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
          options={["popular", "top_rated", "airing_today", "on_the_air"]}
          func={(selected) => {
            setCategory(selected);
            setTvShows([]);
            setPage(1);
            setHasMore(true);
            getTVShows(true, selected, 1);
          }}
        />
      </div>

      <div className="flex flex-wrap justify-center items-stretch gap-6 px-4 sm:px-6 w-full">
        {tvShows.length === 0 && loading ? (
          <Shimmer />
        ) : (
          tvShows.map((item) => (
            <Cards
              key={item.id}
              data={item}
              category="tv"
              hideDetails={false}
            />
          ))
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-blue-300">
          <i className="ri-loader-4-line animate-spin text-xl"></i> Loading
          more...
        </div>
      )}

      {!hasMore && tvShows.length > 0 && (
        <div className="text-center py-4 text-zinc-400">
          No more TV shows to load
        </div>
      )}

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 z-50 group hover:scale-110"
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

export default TVShows;
