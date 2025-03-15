import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ wallpaper, setTrailer }) => {
  const navigate = useNavigate();

  if (!wallpaper || !wallpaper.id) return null;

  const handleNavigation = () => {
    const path =
      wallpaper.media_type === "tv"
        ? `/tv-shows/details/${wallpaper.id}`
        : `/movies/details/${wallpaper.id}`;
    navigate(path);
  };

  return (
    <div
      className="w-full h-[60vh] relative overflow-hidden bg-zinc-900 cursor-pointer"
      onClick={handleNavigation}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${wallpaper.backdrop_path}`}
        alt={wallpaper.title || wallpaper.name}
        className="w-full h-full object-cover object-top select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

      <div className="absolute bottom-6 left-6 md:left-12 text-white max-w-[70%] md:max-w-[50%] space-y-3">
        <h1 className="text-2xl md:text-4xl font-black tracking-wide drop-shadow-lg">
          {wallpaper.title || wallpaper.name}
        </h1>
        <p className="text-xs md:text-sm leading-6 opacity-90">
          {wallpaper.overview?.split(" ").slice(0, 20).join(" ")}...
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm opacity-85">
          <span className="flex items-center gap-1 font-semibold select-none">
            <i className="ri-megaphone-fill text-md text-yellow-400"></i>
            {wallpaper.release_date || wallpaper.first_air_date
              ? new Date(wallpaper.release_date || wallpaper.first_air_date)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(",", "")
              : "Unknown"}
          </span>
          <span className="flex items-center gap-1 font-semibold text-center uppercase select-none">
            {wallpaper.media_type === "tv" ? (
              <i className="ri-tv-fill text-lg text-blue-400"></i>
            ) : (
              <i className="ri-album-fill text-lg text-red-400"></i>
            )}
            {wallpaper.media_type}
          </span>
        </div>

        <button
  className="mt-4 px-2 py-3 flex items-center gap-2 bg-[#6556CD] hover:bg-[#5747C7] text-white font-bold text-sm rounded-sm transition-all group"
  onClick={(e) => {
    e.stopPropagation();
    setTrailer(wallpaper);
  }}
>
  <i className="ri-play-circle-fill text-black text-xl transition-all duration-500 ease-in-out group-hover:text-white"></i> 
  Watch Trailer
</button>
      </div>
    </div>
  );
};

export default Header;
