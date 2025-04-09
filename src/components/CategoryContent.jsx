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
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [mediaType, setMediaType] = useState("movie"); // Default to movie

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
        case "comedy":
          endpoint = `/discover/${mediaType}?with_genres=35&sort_by=${sortBy}&page=${page}`;
          break;
        case "drama":
          endpoint = `/discover/${mediaType}?with_genres=18&sort_by=${sortBy}&page=${page}`;
          break;
        case "sci-fi":
          endpoint = `/discover/${mediaType}?with_genres=878&sort_by=${sortBy}&page=${page}`;
          break;
        case "horror":
          endpoint = `/discover/${mediaType}?with_genres=27&sort_by=${sortBy}&page=${page}`;
          break;
        case "romance":
          endpoint = `/discover/${mediaType}?with_genres=10749&sort_by=${sortBy}&page=${page}`;
          break;
        case "documentary":
          endpoint = `/discover/${mediaType}?with_genres=99&sort_by=${sortBy}&page=${page}`;
          break;
        case "animation":
          endpoint = `/discover/${mediaType}?with_genres=16&sort_by=${sortBy}&page=${page}`;
          break;
        case "thriller":
          endpoint = `/discover/${mediaType}?with_genres=53&sort_by=${sortBy}&page=${page}`;
          break;
        case "family":
          endpoint = `/discover/${mediaType}?with_genres=10751&sort_by=${sortBy}&page=${page}`;
          break;
        default:
          navigate("/notfound");
          return;
      }

      const { data } = await axios.get(endpoint);
      setContent(data.results);
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
    setMediaType(option.toLowerCase());
    setPage(1); // Reset to first page when media type changes
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
      // Show/hide scroll to top button - show after scrolling down 100px
      const shouldShow = window.scrollY > 100;
      console.log(
        "Category - Scroll position for button:",
        window.scrollY,
        "Should show:",
        shouldShow
      );
      setShowTopButton(shouldShow);
    };

    // Add scroll event listener for the button
    window.addEventListener("scroll", handleScrollForButton);

    // Initial check
    handleScrollForButton();

    return () => {
      window.removeEventListener("scroll", handleScrollForButton);
    };
  }, []);

  // Effect for infinite scrolling
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      // Infinite scroll functionality
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.body.offsetHeight - 300; // More aggressive threshold

      if (scrollPosition >= scrollThreshold) {
        if (!loading && page < totalPages) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            console.log("Loading more category content...", {
              scrollPosition,
              scrollThreshold,
              category,
              page,
              totalPages,
            });
            setPage((prevPage) => prevPage + 1);
          }, 200);
        }
      }
    };

    // Add scroll event listener
    console.log("Adding scroll event listener for category content");
    window.addEventListener("scroll", handleScroll);

    // Initial check in case the page is not tall enough
    setTimeout(() => {
      handleScroll();
    }, 500);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
      console.log("Removed scroll event listener for category content");
    };
  }, [loading, page, totalPages, category]);

  // Debug log for page changes
  useEffect(() => {
    console.log(`Category ${category} page changed to ${page}`);
  }, [page, category]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row pt-[12vh] md:pt-0">
      <SideNav onToggle={handleSidebarToggle} />
      <div
        className={`w-full md:w-[80%] lg:w-[82%] xl:w-[85%] h-full overflow-x-hidden overflow-auto pt-14 md:pt-0 transition-all duration-300 ${
          sidebarOpen ? "filter brightness-[0.85]" : ""
        }`}
      >
        <TopNav />

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigate(-1)}
                className="fixed top-20 left-4 sm:left-8 z-50 text-zinc-400 hover:text-white w-10 h-10 flex items-center justify-center bg-[#2c2c2c]/80 backdrop-blur-sm rounded-full shadow-md hover:bg-[#2c2c2c] hover:scale-110 transition-all duration-300"
                aria-label="Go back"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
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

          {loading ? (
            <CategoryShimmer />
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                {content?.map((item, index) => (
                  <Cards key={index} data={item} category={mediaType} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-4">
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

              {/* Scroll to top button */}
              {showTopButton && (
                <button
                  onClick={scrollToTop}
                  className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 z-50 group hover:scale-110"
                  aria-label="Scroll to top"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-white/20 animate-ping-slow opacity-75"></span>
                    <i className="ri-arrow-up-line text-xl group-hover:animate-bounce"></i>
                    <span className="absolute -top-12 right-0 bg-black/80 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg transform group-hover:-translate-y-1">
                      Back to top
                    </span>
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryContent;
