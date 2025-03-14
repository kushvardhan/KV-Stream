import React from "react";
import { Link } from "react-router-dom";

const Header = ({ wallpaper }) => {
  return (
    <div className="w-full h-[55vh] relative overflow-hidden bg-zinc-900">
      {wallpaper ? (
        <>
          <img
            src={`https://image.tmdb.org/t/p/original${wallpaper.backdrop_path}`}
            alt={wallpaper.title || wallpaper.name}
            className="w-full h-full object-cover object-[12%] select-none"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

          <div className="absolute bottom-6 md:bottom-6 left-6 md:left-12 text-white max-w-[70%] md:max-w-[50%] space-y-3">
            <h1 className="text-2xl md:text-4xl font-black tracking-wide drop-shadow-lg">
              {wallpaper.title || wallpaper.name}
            </h1>
            <p className="text-xs md:text-sm leading-6 opacity-90">
              {wallpaper.overview.split(" ").slice(0, 20).join(" ")}
              <Link className="text-blue-300 hover:text-blue-400 font-semibold ml-1">...more</Link>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm opacity-85">
              <span className="flex items-center gap-1 font-semibold select-none">
                <i className="ri-megaphone-fill text-md text-yellow-400"></i>
                {wallpaper.release_date || wallpaper.first_air_date
                  ? new Date(wallpaper.release_date || wallpaper.first_air_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).replace(",", "")
                  : "Unknown"}
              </span>
              <span className="flex items-center gap-1 font-semibold uppercase select-none">
                <i className="ri-album-fill text-md text-red-400"></i>
                {wallpaper.media_type}
              </span>
            </div>
            <Link className="block w-max bg-[#6556cd] hover:bg-[#6656cdd3] text-white font-semibold px-3 py-2 rounded-md transition-all text-xs md:text-xs select-none mt-4">
              Watch Trailer
            </Link>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-end p-6 md:p-10 animate-pulse">
          <div className="w-3/4 h-10 bg-zinc-700 rounded-md"></div>
          <div className="w-1/2 h-5 bg-zinc-600 rounded-md mt-2"></div>
        </div>
      )}
    </div>
  );
};

export default Header;
