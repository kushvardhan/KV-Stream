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

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setPage((prevPage) => prevPage + 1);
        }, 500);
      }
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-200 text-2xl flex items-center gap-3 pb-2">
          <i
            onClick={() => navigate(-1)}
            className="hover:text-blue-300 hover:shadow-[0_0_10px_#1E90FF] transition-all duration-300 text-2xl cursor-pointer ri-arrow-left-line bg-[#2c2c2c] p-2 rounded-md mr-2"
          ></i>
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

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500/50 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <i className="ri-arrow-up-s-line text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default TVShows;
