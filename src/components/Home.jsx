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

  const getWallpaper = async () => {
    try {
      const { data } = await axios.get(`/trending/all/day`);
      "Wallpaper: ", data.results;
      if (data.results.length > 0) {
        let randomData =
          data.results[Math.floor(Math.random() * data.results.length)];
        setWallpaper(randomData);
      }
    } catch (err) {
      err;
    }
  };

  const getTrending = async () => {
    try {
      const { data } = await axios.get(`/trending/all/day`);
      "Trending: ", data.results;
      setTrending(data.results);
    } catch (err) {
      err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWallpaper();
    getTrending();
  }, []);

  return (
    <div className="w-full h-full flex">
      <SideNav />
      <div className="w-[80%] h-full overflow-x-hidden overflow-auto">
        <TopNav />

        {loading ? (
          <div className="w-full h-[40vh] bg-zinc-700 animate-pulse rounded-lg"></div>
        ) : (
          <Header wallpaper={wallpaper} />
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {[...Array(6)].map((_, index) => (
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
