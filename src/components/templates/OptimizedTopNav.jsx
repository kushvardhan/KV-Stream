import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { searchMulti } from "../../utils/apiService";

/**
 * Optimized TopNav component with improved performance
 */
const OptimizedTopNav = () => {
  const [searchBar, setSearchBar] = useState("");
  const [searches, setSearches] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  // Check if we're on the popular page to use different background color
  const isPopularPage = location.pathname.includes("/popular");

  // Debounced search function to prevent too many API calls
  const debouncedSearch = useCallback(
    async (query) => {
      if (!query || query.trim() === "") {
        setSearches(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const data = await searchMulti(query);
        setSearches(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearches([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Use effect for search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchBar.trim() !== "") {
        debouncedSearch(searchBar);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchBar, debouncedSearch]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearches(null);
        setSearchBar("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside, {
      capture: true,
    });
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
    };
  }, []);

  // Effect to scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && searchResultsRef.current) {
      const selectedElement = searchResultsRef.current.querySelector(
        `li:nth-child(${selectedIndex + 1})`
      );
      
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Handle keyboard navigation
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
        navigateToResult(selected);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSearches(null);
      setSearchBar("");
    }
  };

  // Navigate to search result
  const navigateToResult = (item) => {
    const mediaType = item.media_type;
    const id = item.id;

    let url = "/movies/details/" + id;
    if (mediaType === "tv") {
      url = "/tv-shows/details/" + id;
    } else if (mediaType === "person") {
      url = "/peoples/details/" + id;
    }

    window.location.href = url;
  };

  // Memoize search results to prevent unnecessary re-renders
  const filteredSearches = useMemo(() => {
    if (!searches) return [];
    return searches.filter(search => search.title || search.name);
  }, [searches]);

  return (
    <div
      className={`w-full h-[12vh] px-4 sm:px-16 py-4 sm:py-6 flex items-center justify-between md:justify-center z-[9995] ${
        isPopularPage ? "bg-[#25262B]" : "bg-[#1F1E24]"
      } transition-all duration-300 border-b border-zinc-800`}
    >
      <div className="flex items-center w-full">
        {/* Hamburger menu for mobile - only shown on small screens and on home page */}
        {isHomePage && (
          <button
            onClick={() => {
              try {
                const event = new CustomEvent("toggle-sidebar");
                window.dispatchEvent(event);
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
          className="relative w-full md:w-[60%] lg:w-[60%] max-w-3xl mx-auto drop-shadow-md z-[9996]"
        >
          <div className="relative group hover:scale-[1.01] transition-transform duration-300 z-[9997]">
            <input
              ref={searchInputRef}
              value={searchBar}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchBar(e.target.value)}
              type="text"
              placeholder="Search for Movies, TV Shows or People..."
              style={{ userSelect: "none", position: "relative", zIndex: 9999 }}
              className={`w-full ${isHomePage ? "py-3.5" : "py-3"} ${
                isHomePage ? "pl-14" : "pl-12"
              } pr-4 text-white ${
                isHomePage ? "bg-black" : "bg-[#121212]"
              } border border-zinc-800 rounded-full focus:outline-none focus:ring-0 focus:border-zinc-700 outline-none shadow-none hover:bg-[#1a1a1a] hover:border-zinc-700 focus:bg-black transition-all duration-300 ${
                isHomePage ? "text-lg" : "text-base"
              } font-medium select-none`}
            />
            <i
              className={`ri-search-line absolute ${
                isHomePage ? "left-5" : "left-4"
              } top-1/2 transform -translate-y-1/2 text-[#6556CD] ${
                isHomePage ? "text-3xl" : "text-2xl"
              } transition-colors duration-300 drop-shadow-[0_0_2px_rgba(101,86,205,0.5)] z-[9999]`}
            ></i>
            
            {/* Show loading indicator while searching */}
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 z-[9999]">
                <div className="w-5 h-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Clear button */}
            {searchBar && !isSearching && (
              <button
                onClick={() => {
                  setSearchBar("");
                  setSearches(null);
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white z-[9999]"
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>

          {/* Search results backdrop */}
          {searches && (
            <div
              className="fixed inset-0 bg-black/50 z-[9990] backdrop-blur-sm pointer-events-auto"
              style={{
                top: searchContainerRef.current
                  ? searchContainerRef.current.getBoundingClientRect().bottom +
                    "px"
                  : "60px",
              }}
              onClick={() => {
                setSearches(null);
                setSearchBar("");
              }}
            ></div>
          )}

          {/* Search results */}
          {searches && filteredSearches.length > 0 && (
            <div className="absolute top-full mt-2 w-[115%] max-w-[90vw] md:max-w-[600px] left-1/2 -translate-x-1/2 bg-[#2c2c2c] rounded-md shadow-lg z-[9999] max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#6556CD] scrollbar-track-[#2c2c2c] border border-zinc-700/30 search-results">
              <div className="p-2">
                <h3 className="text-zinc-400 text-xs font-semibold mb-2 px-2">
                  Search Results
                </h3>
                <ul ref={searchResultsRef}>
                  {filteredSearches.map((search, index) => (
                    <li
                      key={search.id}
                      className={`${
                        selectedIndex === index
                          ? "bg-[#6556CD]/20 text-white border-l-4 border-[#6556CD] pl-1"
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
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* No results */}
          {searches && filteredSearches.length === 0 && (
            <div className="absolute top-full mt-2 w-[115%] max-w-[90vw] md:max-w-[600px] left-1/2 -translate-x-1/2 bg-[#2c2c2c] rounded-md shadow-lg z-[9999] border border-zinc-700/30 search-results">
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

export default OptimizedTopNav;
