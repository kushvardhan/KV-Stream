import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import Cards from "./templates/Cards";
import CategoryShimmer from "./templates/CategoryShimmer";
import DropDown from "./templates/DropDown";
import SideNav from "./templates/SideNav";
import TopNav from "./templates/TopNav";

const CategoryContent = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [mediaType, setMediaType] = useState("movie");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set document title based on category
  useEffect(() => {
    document.title = `KV | ${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`;
  }, [category]);

  // Function to handle sidebar state changes
  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  // Get content based on category
  const getContent = async () => {
    setLoading(true);
    try {
      let endpoint = "";

      // Map category to appropriate TMDB endpoint
      switch (category.toLowerCase()) {
        case "action":
          endpoint = `/discover/${mediaType}?with_genres=28&sort_by=${sortBy}&page=${page}`;
          break;
        case "adventure":
          endpoint = `/discover/${mediaType}?with_genres=12&sort_by=${sortBy}&page=${page}`;
          break;
        case "animation":
          endpoint = `/discover/${mediaType}?with_genres=16&sort_by=${sortBy}&page=${page}`;
          break;
        case "comedy":
          endpoint = `/discover/${mediaType}?with_genres=35&sort_by=${sortBy}&page=${page}`;
          break;
        case "crime":
          endpoint = `/discover/${mediaType}?with_genres=80&sort_by=${sortBy}&page=${page}`;
          break;
        case "documentary":
          endpoint = `/discover/${mediaType}?with_genres=99&sort_by=${sortBy}&page=${page}`;
          break;
        case "drama":
          endpoint = `/discover/${mediaType}?with_genres=18&sort_by=${sortBy}&page=${page}`;
          break;
        case "family":
          endpoint = `/discover/${mediaType}?with_genres=10751&sort_by=${sortBy}&page=${page}`;
          break;
        case "fantasy":
          endpoint = `/discover/${mediaType}?with_genres=14&sort_by=${sortBy}&page=${page}`;
          break;
        case "history":
          endpoint = `/discover/${mediaType}?with_genres=36&sort_by=${sortBy}&page=${page}`;
          break;
        case "horror":
          endpoint = `/discover/${mediaType}?with_genres=27&sort_by=${sortBy}&page=${page}`;
          break;
        case "music":
          endpoint = `/discover/${mediaType}?with_genres=10402&sort_by=${sortBy}&page=${page}`;
          break;
        case "mystery":
          endpoint = `/discover/${mediaType}?with_genres=9648&sort_by=${sortBy}&page=${page}`;
          break;
        case "romance":
          endpoint = `/discover/${mediaType}?with_genres=10749&sort_by=${sortBy}&page=${page}`;
          break;
        case "sci-fi":
          endpoint = `/discover/${mediaType}?with_genres=878&sort_by=${sortBy}&page=${page}`;
          break;
        case "thriller":
          endpoint = `/discover/${mediaType}?with_genres=53&sort_by=${sortBy}&page=${page}`;
          break;
        case "war":
          endpoint = `/discover/${mediaType}?with_genres=10752&sort_by=${sortBy}&page=${page}`;
          break;
        case "western":
          endpoint = `/discover/${mediaType}?with_genres=37&sort_by=${sortBy}&page=${page}`;
          break;
        default:
          navigate("/notfound");
          return;
      }

      console.log(`Fetching data from endpoint: ${endpoint}`);
      const { data } = await axios.get(endpoint);
      console.log(
        `Received ${
          data.results ? data.results.length : 0
        } results for ${mediaType}`
      );

      // Only update content if we have results or if this is a new category/sort/media type
      if (data.results && data.results.length > 0) {
        // If page is 1, replace content, otherwise append
        if (page === 1) {
          setContent(data.results);
        } else {
          setContent((prevContent) => {
            // Add new results without duplicates
            const existingIds = new Set(prevContent.map((item) => item.id));
            const uniqueNewResults = data.results.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...prevContent, ...uniqueNewResults];
          });
        }
      }

      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
    } catch (err) {
      console.error(err);
      navigate("/notfound");
    } finally {
      setLoading(false);
    }
  };

  // Fetch content when parameters change
  useEffect(() => {
    getContent();
  }, [category, page, sortBy, mediaType]);

  // Handle sort change
  const handleSortChange = (option) => {
    let sortValue = "";
    switch (option) {
      case "Popularity":
        sortValue = "popularity.desc";
        break;
      case "Rating":
        sortValue = "vote_average.desc";
        break;
      case "Latest":
        sortValue = "release_date.desc";
        break;
      case "Oldest":
        sortValue = "release_date.asc";
        break;
      default:
        sortValue = "popularity.desc";
    }
    setSortBy(sortValue);
    setPage(1); // Reset to first page when sort changes
  };

  // Handle media type change
  const handleMediaTypeChange = (option) => {
    console.log("Media type changed to:", option);
    // Convert "TV" to "tv" and "Movie" to "movie"
    const mediaTypeValue = option === "TV" ? "tv" : option.toLowerCase();
    console.log("Setting media type to:", mediaTypeValue);
    setMediaType(mediaTypeValue);
    setPage(1); // Reset to first page when media type changes
    setContent([]); // Clear content to avoid showing wrong media type while loading
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
    window.scrollTo(0, 0);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
    window.scrollTo(0, 0);
  };

  // Add infinite scroll
  const [showTopButton, setShowTopButton] = useState(false);

  // Separate effect for scroll-to-top button
  useEffect(() => {
    const handleScrollForButton = () => {
      // Show/hide scroll to top button - show after scrolling down 1+ screen page
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 1; // Just 1 screen height for better visibility
      const shouldShow = window.scrollY > scrollThreshold;

      // Force show the button if we have more than 1 page of content
      if (content.length > 20 || page > 1) {
        setShowTopButton(true);
        return;
      }

      // Only log in development
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Category - Scroll position for button:",
          window.scrollY,
          "Threshold:",
          scrollThreshold,
          "Should show:",
          shouldShow
        );
      }

      setShowTopButton(shouldShow);
    };

    // Add scroll event listener for the button
    window.addEventListener("scroll", handleScrollForButton);

    // Initial check
    handleScrollForButton();

    return () => {
      window.removeEventListener("scroll", handleScrollForButton);
    };
  }, [content.length, page]);

  // Effect for infinite scrolling
  useEffect(() => {
    let timeout;
    let isLoadingMore = false;

    // Disable infinite scroll for category pages - we'll use pagination buttons instead
    const handleScroll = () => {
      // No-op - we're using pagination buttons instead of infinite scroll
      return;
    };

    // Add scroll event listener
    if (process.env.NODE_ENV !== "production") {
      console.log("Adding scroll event listener for category content");
    }
    window.addEventListener("scroll", handleScroll);

    // No auto-loading for category pages - we'll use pagination buttons instead

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
      if (process.env.NODE_ENV !== "production") {
        console.log("Removed scroll event listener for category content");
      }
    };
  }, [loading, page, totalPages, category, mediaType, content.length]);

  // This function is no longer needed as we're using the ScrollToTopButton component
  // which has its own scrollToTop function

  return (
    <div className="w-full h-full flex flex-col md:block pt-4 md:pt-0 category-page">
      <SideNav onToggle={handleSidebarToggle} />
      <div
        className={`w-full md:w-[80%] lg:w-[82%] xl:w-[85%] h-full min-h-screen overflow-x-hidden overflow-auto transition-all duration-300 md:ml-[20%] lg:ml-[18%] xl:ml-[15%] ${
          sidebarOpen ? "filter brightness-[0.85]" : ""
        }`}
      >
        <TopNav />

        <div className="p-4 sm:p-6 pb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sticky top-0 bg-[#1F1E24] z-[50] py-4 -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 border-b border-zinc-800">
            <div className="flex flex-row items-center space-x-4 mb-4 sm:mb-0">
              <div
                className="w-10 h-10 flex-shrink-0 select-none"
                style={{ touchAction: "none" }}
              >
                <div
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md cursor-pointer select-none"
                  aria-label="Go back"
                  style={{ touchAction: "none", transform: "none !important" }}
                >
                  <i className="ri-arrow-left-line text-xl text-zinc-400"></i>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3 ml-14 sm:ml-0 overflow-visible">
              <DropDown
                title="Sort By"
                options={["Popularity", "Rating", "Latest", "Oldest"]}
                func={handleSortChange}
              />
              <DropDown
                title="Type"
                options={["Movie", "TV"]}
                func={handleMediaTypeChange}
              />
            </div>
          </div>

          <div className="mt-8">
            {loading && content.length === 0 ? (
              <CategoryShimmer />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-4 sm:px-6">
                  {content.map((item) => (
                    <Cards
                      key={item.id}
                      data={item}
                      title={mediaType}
                      category={category}
                    />
                  ))}
                </div>

                {loading && (
                  <div className="text-center py-8 text-[#6556CD]">
                    <i className="ri-loader-4-line animate-spin text-2xl"></i>
                    <p className="mt-2">Loading more content...</p>
                  </div>
                )}

                {!loading && content.length === 0 && (
                  <div className="text-center py-8 text-zinc-400 flex flex-col items-center justify-center min-h-[200px]">
                    <i className="ri-emotion-sad-line text-4xl"></i>
                    <p className="mt-2">No content found for this category</p>
                    <p className="mt-4 text-sm text-zinc-500">
                      Try changing the Type or Sort options above
                    </p>
                  </div>
                )}

                {/* Pagination controls - only show if we have more than 1 page */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8 mb-36">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-md ${
                        page === 1
                          ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                          : "bg-[#6556CD] text-white hover:bg-[#5747C7]"
                      } transition-colors`}
                    >
                      Previous
                    </button>
                    <span className="text-white">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-md ${
                        page === totalPages
                          ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                          : "bg-[#6556CD] text-white hover:bg-[#5747C7]"
                      } transition-colors`}
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Use the new ScrollToTopButton component */}
                <div
                  className="scroll-top-button"
                  style={{
                    position: "fixed",
                    bottom: "auto",
                    top: "80vh",
                    right: "4rem",
                    zIndex: 1000,
                    width: "48px",
                    height: "48px",
                    display: showTopButton ? "block" : "none",
                  }}
                >
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:scale-110 transition-transform duration-300"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(to right, rgba(101, 86, 205, 0.9), rgba(79, 70, 229, 0.9))",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                      border: "none",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, opacity 0.3s ease",
                    }}
                    aria-label="Scroll to top"
                  >
                    <i className="ri-arrow-up-line text-xl"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryContent;
