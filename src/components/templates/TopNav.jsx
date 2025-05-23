import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../../utils/axios";

const TopNav = ({ searchOnly = false }) => {
  const [searchBar, setSearchBar] = useState("");
  const [searches, setSearches] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isPopularPage = location.pathname.includes("/popular");

  const getSearches = async () => {
    try {
      if (searchBar.trim() === "") {
        setSearches(null);
        return;
      }
      const { data } = await instance.get(
        `/search/multi?query=${encodeURIComponent(searchBar)}`
      );
      setSearches(data.results || []);
    } catch (err) {
      setSearches([]);
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
    const handleInteraction = (event) => {
      let target = event.target;
      while (target) {
        if (target.dataset && target.dataset.href) {
          window.location.href = target.dataset.href;
          return;
        }
        target = target.parentElement;
      }

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearches(null);
      }
    };

    document.addEventListener("mousedown", handleInteraction, {
      capture: true,
    });
    document.addEventListener("touchstart", handleInteraction, {
      capture: true,
      passive: false,
    });

    return () => {
      document.removeEventListener("mousedown", handleInteraction, {
        capture: true,
      });
      document.removeEventListener("touchstart", handleInteraction, {
        capture: true,
        passive: false,
      });
    };
  }, []);

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

  useEffect(() => {
    const updatePosition = () => {
      if (searches && searches.length > 0 && searchContainerRef.current) {
        setSearches([...searches]);
      }
    };

    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePosition);
    };
  }, [searches]);

  const handleSearchResultClick = (detailPath) => {
    setSearchBar("");
    setSearches(null);
    navigate(detailPath);
  };

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
        const path =
          mediaType === "movie"
            ? `/movies/details/${id}`
            : mediaType === "tv"
            ? `/tv-shows/details/${id}`
            : mediaType === "person"
            ? `/peoples/details/${id}`
            : `/movies/details/${id}`;
        handleSearchResultClick(path);
      }
    }
  };

  return (
    <div
      className={`w-full ${
        searchOnly ? "h-[60px]" : "h-[70px]"
      } px-4 sm:px-16 py-0 flex items-center justify-between md:justify-center ${
        searchOnly ? "" : isPopularPage ? "bg-[#25262B]" : "bg-[#1F1E24]"
      } transition-all duration-300 border-b border-zinc-800`}
      style={{ position: "relative", overflow: "visible" }}
    >
      <div className="flex items-center w-full h-full">
        {isHomePage && !searchOnly && (
          <button
            onClick={() => {
              try {
                const event = new CustomEvent("toggle-sidebar");
                window.dispatchEvent(event);
              } catch (error) {}
            }}
            className="p-2 rounded-md bg-[#1F1E24] text-white md:hidden flex items-center justify-center mr-2 hover:bg-zinc-700 transition-colors hover:scale-110 active:scale-95"
            aria-label="Toggle sidebar menu"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        )}

        <div
          ref={searchContainerRef}
          className="w-full md:w-[60%] lg:w-[60%] max-w-3xl mx-auto h-full flex items-center"
          style={{ position: "relative", overflow: "visible", zIndex: 9995 }}
        >
          <div className="w-full relative" style={{ position: "relative" }}>
            <input
              ref={searchInputRef}
              value={searchBar}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchBar(e.target.value)}
              type="text"
              placeholder="Search for Movies, TV Shows or People..."
              className={`w-full h-[46px] ${
                isHomePage ? "pl-14" : "pl-12"
              } pr-4 text-white ${
                isHomePage ? "bg-black" : "bg-[#121212]"
              } border border-zinc-800 rounded-full focus:outline-none focus:ring-0 focus:border-zinc-700 outline-none shadow-none hover:bg-[#1a1a1a] hover:border-zinc-700 focus:bg-black transition-all duration-300 ${
                isHomePage ? "text-lg" : "text-base"
              } font-medium select-none`}
              style={{ position: "relative", zIndex: 9996 }}
            />
            <i
              className={`ri-search-line absolute ${
                isHomePage ? "left-5" : "left-4"
              } top-1/2 transform -translate-y-1/2 text-[#6556CD] ${
                isHomePage ? "text-3xl" : "text-2xl"
              } transition-colors duration-300 drop-shadow-[0_0_2px_rgba(101,86,205,0.5)] z-[9997]`}
            ></i>
            {searchBar && (
              <button
                onClick={() => {
                  setSearchBar("");
                  setSearches(null);
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white z-[9997]"
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {searches && (
        <div
          className="fixed inset-0 bg-transparent"
          style={{ zIndex: 9990 }}
          onClick={() => {
            setSearches(null);
          }}
        ></div>
      )}

      {searches && searches.length > 0 && (
        <div
          className="bg-[#2c2c2c] rounded-md shadow-lg max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#6556CD] scrollbar-track-[#2c2c2c] border border-zinc-700/30 search-results pointer-events-auto touch-manipulation"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: searchContainerRef.current
              ? searchContainerRef.current.getBoundingClientRect().bottom +
                2 +
                "px"
              : "60px",
            left: searchContainerRef.current
              ? searchContainerRef.current.getBoundingClientRect().left +
                searchContainerRef.current.getBoundingClientRect().width / 2 +
                "px"
              : "50%",
            transform: "translateX(-50%)",
            width: searchContainerRef.current
              ? searchContainerRef.current.getBoundingClientRect().width + "px"
              : "60%",
            zIndex: 10000,
          }}
        >
          <div className="p-2" onClick={(e) => e.stopPropagation()}>
            <h3
              className="text-zinc-400 text-xs font-semibold mb-2 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              Search Results
            </h3>
            <ul ref={searchResultsRef} onClick={(e) => e.stopPropagation()}>
              {searches.map((search, index) => {
                if (!search.title && !search.name) return null;
                const detailPath =
                  search.media_type === "movie"
                    ? `/movies/details/${search.id}`
                    : search.media_type === "tv"
                    ? `/tv-shows/details/${search.id}`
                    : search.media_type === "person"
                    ? `/peoples/details/${search.id}`
                    : `/movies/details/${search.id}`;

                return (
                  <li
                    key={search.id}
                    data-href={detailPath}
                    onClick={() => {
                      window.location.assign(
                        window.location.origin + detailPath
                      );
                    }}
                    className={`cursor-pointer touch-manipulation ${
                      selectedIndex === index
                        ? "bg-[#6556CD]/20 text-white border-l-4 border-[#6556CD] pl-1"
                        : "text-zinc-300 hover:bg-[#3c3c3c]"
                    } rounded-md transition-all duration-200 hover:shadow-md active:shadow-inner hover:bg-[#3c3c3c]/80 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#6556CD]/50`}
                  >
                    <button
                      type="button"
                      data-href={detailPath}
                      onClick={(e) => {
                        e.stopPropagation();

                        window.location.assign(
                          window.location.origin + detailPath
                        );
                      }}
                      className="flex items-center p-3 w-full group touch-manipulation bg-transparent border-0"
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "inherit",
                        WebkitTapHighlightColor: "rgba(0,0,0,0)",
                        WebkitTouchCallout: "none",
                        userSelect: "none",
                        textAlign: "left",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-md overflow-hidden bg-[#3c3c3c] flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.assign(
                            window.location.origin + detailPath
                          );
                        }}
                      >
                        {search.poster_path || search.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${
                              search.poster_path || search.profile_path
                            }`}
                            alt={search.title || search.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.assign(
                                window.location.origin + detailPath
                              );
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center bg-[#3c3c3c] text-zinc-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.assign(
                                window.location.origin + detailPath
                              );
                            }}
                          >
                            <i
                              className={
                                search.media_type === "movie"
                                  ? "ri-film-line"
                                  : search.media_type === "tv"
                                  ? "ri-tv-2-line"
                                  : "ri-user-line"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.assign(
                                  window.location.origin + detailPath
                                );
                              }}
                            ></i>
                          </div>
                        )}
                      </div>
                      <div
                        className="ml-3 flex-1 min-w-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.assign(
                            window.location.origin + detailPath
                          );
                        }}
                      >
                        <p
                          className="text-sm font-medium truncate"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.assign(
                              window.location.origin + detailPath
                            );
                          }}
                        >
                          {search.title || search.name}
                        </p>
                        <p
                          className="text-xs text-zinc-400 truncate"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.assign(
                              window.location.origin + detailPath
                            );
                          }}
                        >
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
                      <div
                        className="ml-2 text-[#6556CD] group-hover:translate-x-1 transition-transform duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.assign(
                            window.location.origin + detailPath
                          );
                        }}
                      >
                        <i
                          className="ri-arrow-right-s-line"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.assign(
                              window.location.origin + detailPath
                            );
                          }}
                        ></i>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {searches && searches.length === 0 && (
        <div
          className="bg-[#2c2c2c] rounded-md shadow-lg border border-zinc-700/30 search-results pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: searchContainerRef.current
              ? searchContainerRef.current.getBoundingClientRect().bottom +
                2 +
                "px"
              : "60px",
            left: searchContainerRef.current
              ? searchContainerRef.current.getBoundingClientRect().left +
                searchContainerRef.current.getBoundingClientRect().width / 2 +
                "px"
              : "50%",
            transform: "translateX(-50%)",
            width: searchContainerRef.current
              ? searchContainerRef.current.getBoundingClientRect().width + "px"
              : "60%",
            zIndex: 10000,
          }}
        >
          <div className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-zinc-400" onClick={(e) => e.stopPropagation()}>
              No results found
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;
