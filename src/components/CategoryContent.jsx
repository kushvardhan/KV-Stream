import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./templates/SideNav";
import TopNav from "./templates/TopNav";
import Cards from "./templates/Cards";
import DropDown from "./templates/DropDown";
import Shimmer from "./templates/Shimmer";

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
    document.title = `KV | ${category.charAt(0).toUpperCase() + category.slice(1)}`;
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
      switch(category.toLowerCase()) {
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

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <SideNav onToggle={handleSidebarToggle} />
      <div
        className={`w-full md:w-[80%] lg:w-[82%] xl:w-[85%] h-full overflow-x-hidden overflow-auto pt-14 md:pt-0 transition-all duration-300 ${
          sidebarOpen ? "filter brightness-[0.7]" : ""
        }`}
      >
        <TopNav />

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
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
            <Shimmer />
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryContent;
