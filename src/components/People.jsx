import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Shimmer from "./templates/Shimmer";
import TopNav from "./templates/TopNav";
import noImage from "/noImage.jpeg";

const People = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  document.title = "KV | People";

  const getPeople = async (reset = false, selectedPage = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { data } = await axios.get(`/person/popular?page=${selectedPage}`);
      const results = data.results || [];
      setPeople((prev) => {
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
    <div className="pt-[12vh] pb-4 w-screen min-h-screen bg-[#1F1E24] flex flex-col overflow-x-hidden">
      <div className="w-full flex items-center gap-3 mb-6 px-4 sm:px-6">
        <h1 className="font-bold text-2xl flex items-center gap-3 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-red-500 hover:shadow-[0_0_10px_#d9534f] transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          People
        </h1>
      </div>

      <div className="w-full mb-12 px-4 sm:px-6">
        <TopNav />
      </div>

      <div className="flex flex-wrap justify-center gap-8 items-center px-4 sm:px-6 w-full">
        {people.length === 0 && loading ? (
          <Shimmer />
        ) : (
          people.map((item) => (
            <Link
              key={item.id}
              to={`/peoples/details/${item.id}`}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
            >
              <div className="bg-[#2c2c2c] rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <img
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                      : noImage
                  }
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/500x750?text=No+Image")
                  }
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-300">
                    {item.name}
                  </h2>
                  <p className="text-gray-400">
                    {item.gender === 1 ? "Female" : "Male"}
                  </p>
                  <span className="text-red-300 text-xs mt-1 hover:underline block">
                    Click to Know more...
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-red-500">
          <i className="ri-loader-4-line animate-spin text-xl"></i> Loading
          more...
        </div>
      )}

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-red-400/50 text-white p-4 rounded-full shadow-lg hover:bg-red-600/50 transition"
        >
          <i className="ri-arrow-up-s-line text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default People;
