import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import instance from "../../../utils/axios";

const TopNav = () => {
  const [searchBar, setSearchBar] = useState("");
  const [searches, setSearches] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  const getSearches = async () => {
    try {
      if (searchBar.trim() === "") {
        setSearches(null);
        return;
      }
      const { data } = await instance.get(`/search/multi?query=${searchBar}`);
      setSearches(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchBar.trim() !== "") {
        getSearches();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
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

  const handleKeyDown = (e) => {
    if (!searches) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < searches.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = searches[selectedIndex];
      if (selected) {
        const mediaType = selected.media_type;
        const id = selected.id;

        if (mediaType === "movie") {
          window.location.href = `/movies/details/${id}`;
        } else if (mediaType === "tv") {
          window.location.href = `/tv-shows/details/${id}`;
        } else if (mediaType === "person") {
          window.location.href = `/peoples/details/${id}`;
        } else {
          window.location.href = `/movies/details/${id}`;
        }
      }
    }
  };

  return (
    <div className="w-full h-[12vh] px-4 sm:px-16 py-4 sm:py-6 flex items-center justify-between md:justify-center z-[95] bg-[#1F1E24] transition-all duration-300 border-b border-zinc-800">
      <div className="flex items-center w-full">
        {/* Hamburger menu for mobile - only shown on small screens and on home page */}
        {isHomePage && (
          <button
            onClick={() => {
              // Only log in development
              if (process.env.NODE_ENV !== "production") {
                console.log("Hamburger button clicked");
              }

              // Create and dispatch a custom event to toggle the sidebar
              try {
                const event = new CustomEvent("toggle-sidebar");

                // Only log in development
                if (process.env.NODE_ENV !== "production") {
                  console.log("Dispatching toggle-sidebar event");
                }

                window.dispatchEvent(event);

                // Only log in development
                if (process.env.NODE_ENV !== "production") {
                  console.log("Event dispatched successfully");
                }
              } catch (error) {
                console.error("Error dispatching toggle-sidebar event:", error);
              }
            }}
            className="p-2 rounded-md bg-[#1F1E24] text-white md:hidden flex items-center justify-center mr-2 hover:bg-zinc-700 transition-colors hover:scale-110 active:scale-95"
            aria-label="Toggle sidebar menu"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        )}

        {/* Search container */}
        <div
          ref={searchContainerRef}
          className="relative w-full md:w-[60%] lg:w-[60%] max-w-3xl mx-auto"
        >
          <div className="relative group hover:scale-[1.01] transition-transform duration-300">
            <input
              ref={searchInputRef}
              value={searchBar}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchBar(e.target.value)}
              type="text"
              placeholder="Search for Movies, TV Shows or People..."
              className="w-full py-3 pl-12 pr-4 text-white bg-[#3a3a3a] rounded-full focus:outline-none focus:ring-0 focus:border-0 border-0 outline-none shadow-none hover:bg-[#444444] transition-all duration-300 text-base font-medium"
            />
            <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6556CD] text-2xl transition-colors duration-300"></i>
            {searchBar && (
              <button
                onClick={() => {
                  setSearchBar("");
                  setSearches(null);
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>

          {/* Search results */}
          {searches && searches.length > 0 && (
            <div className="absolute mt-2 w-[115%] left-1/2 -translate-x-1/2 bg-[#2c2c2c] rounded-md shadow-lg z-50 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#6556CD] scrollbar-track-[#2c2c2c] border border-zinc-700/30">
              <div className="p-2">
                <h3 className="text-zinc-400 text-xs font-semibold mb-2 px-2">
                  Search Results
                </h3>
                <ul>
                  {searches.map((search, index) => {
                    // Skip items without title or name
                    if (!search.title && !search.name) return null;

                    return (
                      <li
                        key={search.id}
                        className={`${
                          selectedIndex === index
                            ? "bg-[#6556CD]/20 text-white"
                            : "text-zinc-300 hover:bg-[#3c3c3c]"
                        } rounded-md transition-colors duration-200`}
                      >
                        <Link
                          to={
                            search.media_type === "movie"
                              ? `/movies/details/${search.id}`
                              : search.media_type === "tv"
                              ? `/tv-shows/details/${search.id}`
                              : search.media_type === "person"
                              ? `/peoples/details/${search.id}`
                              : `/movies/details/${search.id}`
                          }
                          className="flex items-center p-2"
                          onClick={() => {
                            setSearchBar("");
                            setSearches(null);
                          }}
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-[#3c3c3c] flex-shrink-0">
                            {search.poster_path || search.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${
                                  search.poster_path || search.profile_path
                                }`}
                                alt={search.title || search.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#3c3c3c] text-zinc-500">
                                <i
                                  className={
                                    search.media_type === "movie"
                                      ? "ri-film-line"
                                      : search.media_type === "tv"
                                      ? "ri-tv-2-line"
                                      : "ri-user-line"
                                  }
                                ></i>
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {search.title || search.name}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {search.media_type === "movie"
                                ? "Movie"
                                : search.media_type === "tv"
                                ? "TV Show"
                                : "Person"}
                              {search.release_date &&
                                ` • ${search.release_date.split("-")[0]}`}
                              {search.first_air_date &&
                                ` • ${search.first_air_date.split("-")[0]}`}
                            </p>
                          </div>
                          <div className="ml-2 text-zinc-400">
                            <i className="ri-arrow-right-s-line"></i>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* No results */}
          {searches && searches.length === 0 && (
            <div className="absolute mt-2 w-[115%] left-1/2 -translate-x-1/2 bg-[#2c2c2c] rounded-md shadow-lg z-50 border border-zinc-700/30">
              <div className="p-4 text-center">
                <p className="text-zinc-400">No results found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
