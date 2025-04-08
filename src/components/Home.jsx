import React, { useEffect, useState } from "react";
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

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <SideNav />
      <div className="w-full md:w-[80%] lg:w-[82%] xl:w-[85%] h-full overflow-x-hidden overflow-auto pt-14 md:pt-0">
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
          <HorizontalCard trending={trending} />
        )}
      </div>
    </div>
  );
};

export default Home;
