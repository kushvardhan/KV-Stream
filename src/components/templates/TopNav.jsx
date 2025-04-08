import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../../../utils/axios";
import noImage from "/noImage.jpeg";

const TopNav = () => {
  const [searchBar, setSearchBar] = useState("");
  const [searches, setSearches] = useState(null);
  const searchContainerRef = useRef(null);

  const getSearches = async () => {
    try {
      if (searchBar.trim() === "") {
        setSearches(null);
        return;
      }
      const { data } = await instance.get(`/search/multi?query=${searchBar}`);
      setSearches(data.results);
    } catch (err) {
      err;
    }
  };

  useEffect(() => {
    getSearches();
  }, [searchBar]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearches(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-[10vh] px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-center z-50 fixed md:static top-0 left-0 bg-[#1F1E24] md:bg-transparent">
      <i className="ri-search-line text-zinc-300 text-xl sm:text-2xl mt-3"></i>
      <input
        value={searchBar}
        onChange={(e) => setSearchBar(e.target.value)}
        type="text"
        className={`border-[1px] border-zinc-600 bg-[#1F1E24] w-[70%] sm:w-[60%] md:w-[50%] max-w-[500px] mt-3 ml-2 sm:ml-5 mr-1 p-1 sm:p-2 px-3 sm:px-5 outline-none transition-all duration-300 text-sm sm:text-base ${
          searchBar ? "rounded-r-md rounded-l-full" : "rounded-full"
        }`}
        placeholder="Search..."
      />
      <i
        onClick={() => setSearchBar("")}
        className={`ri-close-line text-lg sm:text-xl px-1 py-1 rounded-full hover:bg-zinc-700 text-zinc-200 mt-3 cursor-pointer transition-all duration-300 ${
          searchBar ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      ></i>

      {searches && (
        <div
          ref={searchContainerRef}
          className={`absolute max-w-[90%] sm:max-w-[80%] md:max-w-[60%] w-auto min-w-[80vw] sm:min-w-[60vw] md:min-w-[50vw] max-h-[40vh] sm:max-h-[50vh] md:max-h-[55vh] rounded-lg overflow-y-auto overflow-x-hidden bg-zinc-600 top-[100%] left-1/2 transform -translate-x-1/2 transition-all duration-300 z-[9999] shadow-lg ${
            searchBar
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          }`}
        >
          {searches.map((s, i) => {
            const type = s.media_type;
            let linkPath = "#";
            if (type === "movie") {
              linkPath = `/movies/details/${s.id}`;
            } else if (type === "tv") {
              linkPath = `/tv-shows/details/${s.id}`;
            } else if (type === "person") {
              linkPath = `/peoples/details/${s.id}`;
            }

            return (
              <Link
                key={i}
                to={linkPath}
                className="flex items-center w-full py-3 sm:py-4 px-3 sm:px-5 bg-zinc-700 text-zinc-300 font-semibold border-b-[1px] border-zinc-500 duration-300 transform transition-all hover:bg-zinc-500 hover:text-white"
              >
                <img
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-cover rounded shadow-md transition-transform duration-300 ease-in-out hover:scale-110"
                  src={
                    s.poster_path ||
                    s.profile_path ||
                    s.backdrop_path ||
                    s.still_path ||
                    s.file_path ||
                    s.logo_path
                      ? `https://image.tmdb.org/t/p/w500${
                          s.poster_path ||
                          s.profile_path ||
                          s.backdrop_path ||
                          s.still_path ||
                          s.file_path ||
                          s.logo_path
                        }`
                      : noImage
                  }
                  alt={s.title || s.original_title || s.name || s.original_name}
                />
                <h3 className="ml-2 sm:ml-3 text-xs sm:text-sm md:text-base truncate">
                  {s.title || s.original_title || s.name || s.original_name}
                </h3>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopNav;
