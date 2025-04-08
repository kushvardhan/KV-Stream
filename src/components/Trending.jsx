import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
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
          setTrending((prev) =>
            reset ? data.results : [...prev, ...data.results]
          );
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

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setPage((prevPage) => prevPage + 1);
      }
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (page > 1) getTrending();
  }, [page]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-300 text-2xl flex items-center gap-3">
          <i
            onClick={() => navigate(-1)}
            className="hover:text-[#a69ddb] hover:shadow-[0_0_10px_#6556CD] transition-all duration-300 text-2xl cursor-pointer ri-arrow-left-line bg-[#2c2c2c] p-2 rounded-md mr-2"
          ></i>
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

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-[#1F1E24]">
        {trending.length === 0 && loading ? (
          <Shimmer />
        ) : (
          <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-6">
            {[...new Map(trending.map((item) => [item.id, item])).values()].map(
              (item) => (
                <Cards key={item.id} data={item} title={category} />
              )
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-zinc-300">
          <i className="ri-loader-4-line animate-spin text-xl"></i> Loading
          more...
        </div>
      )}

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-zinc-400/50 text-white p-4 rounded-full shadow-lg hover:bg-[#6556CD]/60 transition"
        >
          <i className="ri-arrow-up-s-line text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default Trending;
