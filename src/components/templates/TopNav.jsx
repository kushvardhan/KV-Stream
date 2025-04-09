import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../../../utils/axios";
import noImage from "/noImage.jpeg";

const TopNav = () => {
  const [searchBar, setSearchBar] = useState("");
  const [searches, setSearches] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

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
    setSelectedIndex(-1);
  }, [searchBar]);

  const getPath = (item) => {
    const type = item.media_type;
    if (type === "movie") {
      return `/movies/details/${item.id}`;
    } else if (type === "tv") {
      return `/tv-shows/details/${item.id}`;
    } else if (type === "person") {
      return `/peoples/details/${item.id}`;
    }
    return "#";
  };

  const handleKeyDown = (e) => {
    if (!searches) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searches.length - 1 ? prev + 1 : prev
      );
    }

    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    // Enter key
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = searches[selectedIndex];
      if (selected) {
        const path = getPath(selected);
        window.location.href = path;
      }
    }
  };

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
    <div className="w-full h-[10vh] px-4 sm:px-16 py-2 sm:py-3 flex items-center justify-between md:justify-center z-[95] fixed md:static top-0 left-0 bg-[#1F1E24] md:bg-transparent">
      <div className="flex items-center">
        {/* Hamburger menu for mobile - only shown on small screens */}
        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("toggle-sidebar"))
          }
          className="p-2 rounded-md bg-[#1F1E24] text-white md:hidden flex items-center justify-center mr-2"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        <i className="ri-search-line text-zinc-300 text-xl sm:text-2xl"></i>
      </div>
      <div className="flex items-center flex-1 justify-center">
        <input
          ref={searchInputRef}
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          className={`border-[1px] border-zinc-600 bg-[#1F1E24] w-[70%] sm:w-[60%] md:w-[50%] max-w-[500px] ml-2 sm:ml-5 mr-1 p-1 sm:p-2 px-3 sm:px-5 outline-none transition-all duration-300 text-sm sm:text-base ${
            searchBar ? "rounded-r-md rounded-l-full" : "rounded-full"
          }`}
          placeholder="Search..."
        />
        <i
          onClick={() => setSearchBar("")}
          className={`ri-close-line text-lg sm:text-xl px-1 py-1 rounded-full hover:bg-zinc-700 text-zinc-200 cursor-pointer transition-all duration-300 ${
            searchBar ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        ></i>
      </div>

      {/* Placeholder div for balance */}
      <div className="w-10 md:hidden"></div>

      {searches && (
        <div
          ref={searchContainerRef}
          className={`fixed max-w-[90%] sm:max-w-[80%] md:max-w-[60%] w-auto min-w-[80vw] sm:min-w-[60vw] md:min-w-[50vw] max-h-[40vh] sm:max-h-[50vh] md:max-h-[55vh] rounded-lg overflow-y-auto overflow-x-hidden bg-zinc-600 top-[10vh] left-1/2 transform -translate-x-1/2 transition-all duration-300 z-[999] shadow-lg ${
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
                className={`flex items-center w-full py-3 sm:py-4 px-3 sm:px-5 ${
                  selectedIndex === i
                    ? "bg-zinc-500 text-white"
                    : "bg-zinc-700 text-zinc-300"
                } font-semibold border-b-[1px] border-zinc-500 duration-300 transform transition-all hover:bg-zinc-500 hover:text-white`}
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
