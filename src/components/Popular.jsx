import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
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

        setPopular((prev) => {
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
    },
    [page, category]
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
    <div className="py-4 w-screen min-h-screen bg-[#25262B] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-zinc-400 text-2xl flex items-center gap-3 pb-2 mt-10 md:mt-0">
          <i
            onClick={() => navigate(-1)}
            className="hover:text-orange-500 hover:shadow-[0_0_10px_#FF7F50] transition-all duration-300 text-2xl cursor-pointer ri-arrow-left-line bg-[#2c2c2c] p-2 rounded-md mr-2 fixed top-16 left-4 z-[100] md:static md:top-auto md:left-auto md:z-auto"
          ></i>
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
              hideDetails={true}
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

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-500/50 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition"
        >
          <i className="ri-arrow-up-s-line text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default Popular;
