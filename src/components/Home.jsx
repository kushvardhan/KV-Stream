import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import Header from "./templates/Header";
import HorizontalCard from "./templates/HorizontalCard";
import SideNav from "./templates/SideNav";
import TopNav from "./templates/TopNav";

const Home = () => {
  document.title = "KV | Homepage";

  const [wallpaper, setWallpaper] = useState(null);
  const [trending, setTrending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and update state
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const getWallpaper = async () => {
    try {
      const { data } = await axios.get(`/trending/all/day`);
      if (data.results.length > 0) {
        let randomData =
          data.results[Math.floor(Math.random() * data.results.length)];
        setWallpaper(randomData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTrending = async () => {
    try {
      const { data } = await axios.get(`/trending/all/day`);
      setTrending(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWallpaper();
    getTrending();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to handle sidebar state changes
  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <SideNav onToggle={handleSidebarToggle} />
      <div
        className={`w-full md:w-[80%] lg:w-[82%] xl:w-[85%] h-full overflow-x-hidden overflow-auto pt-14 md:pt-0 transition-all duration-300 ${
          sidebarOpen ? "filter brightness-[0.85]" : ""
        }`}
      >
        <TopNav />

        {loading ? (
          <div className="w-full h-[30vh] sm:h-[40vh] md:h-[50vh] bg-zinc-700 animate-pulse rounded-lg"></div>
        ) : (
          <Header wallpaper={wallpaper} />
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {[...Array(isMobile ? 4 : 6)].map((_, index) => (
              <div
                key={index}
                className="h-36 bg-zinc-700 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <HorizontalCard trending={trending} />

            <div className="mt-4 p-4">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Popular Categories
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                  {
                    name: "Action",
                    icon: "ri-sword-fill",
                    color: "bg-red-500",
                  },
                  {
                    name: "Comedy",
                    icon: "ri-emotion-laugh-fill",
                    color: "bg-yellow-500",
                  },
                  {
                    name: "Drama",
                    icon: "ri-emotion-sad-fill",
                    color: "bg-blue-500",
                  },
                  {
                    name: "Sci-Fi",
                    icon: "ri-rocket-fill",
                    color: "bg-purple-500",
                  },
                  {
                    name: "Horror",
                    icon: "ri-ghost-fill",
                    color: "bg-gray-700",
                  },
                  {
                    name: "Romance",
                    icon: "ri-heart-fill",
                    color: "bg-pink-500",
                  },
                  {
                    name: "Documentary",
                    icon: "ri-film-fill",
                    color: "bg-green-500",
                  },
                  {
                    name: "Animation",
                    icon: "ri-mickey-fill",
                    color: "bg-indigo-500",
                  },
                  {
                    name: "Thriller",
                    icon: "ri-knife-blood-fill",
                    color: "bg-red-700",
                  },
                  {
                    name: "Family",
                    icon: "ri-parent-fill",
                    color: "bg-teal-500",
                  },
                ].map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${category.name.toLowerCase()}`}
                    className={`${category.color} rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transform transition-transform hover:scale-105 h-24 sm:h-32`}
                  >
                    <i
                      className={`${category.icon} text-2xl sm:text-3xl text-white mb-2`}
                    ></i>
                    <span className="text-sm sm:text-base font-medium text-white text-center">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Latest Updates
              </h2>
              <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      New Features Added
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Explore our latest improvements
                    </p>
                  </div>
                  <Link
                    to="/features"
                    className="mt-2 sm:mt-0 px-4 py-2 bg-[#6556CD] hover:bg-[#5747C7] text-white rounded-md text-sm font-medium transition-colors inline-block"
                  >
                    Learn More
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {[
                    {
                      title: "Improved Search",
                      desc: "Find your favorite movies faster",
                    },
                    {
                      title: "Personalized Recommendations",
                      desc: "Discover new content based on your taste",
                    },
                    {
                      title: "Watch Parties",
                      desc: "Watch movies together with friends",
                    },
                  ].map((feature, index) => (
                    <Link
                      key={index}
                      to="/features"
                      className="bg-zinc-700 p-3 rounded-md block hover:bg-zinc-600 transition-colors"
                    >
                      <h4 className="font-medium text-white">
                        {feature.title}
                      </h4>
                      <p className="text-zinc-400 text-xs mt-1">
                        {feature.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
