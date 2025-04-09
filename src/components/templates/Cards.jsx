import React from "react";
import { Link } from "react-router-dom";

const Cards = ({ data, category, hideDetails }) => {
  const mediaType = data.media_type || category;

  const shortOverview = data.overview
    ? data.overview.split(" ").slice(0, 18).join(" ") + "..."
    : "No description available.";

  const getPath = () => {
    if (mediaType === "movie") return `/movies/details/${data.id}`;
    if (mediaType === "tv") return `/tv-shows/details/${data.id}`;
    return `/people/details/${data.id}`;
  };

  return (
    <Link
      to={getPath()}
      className="relative rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 w-full h-[300px] sm:h-[320px] md:h-[350px] lg:h-[370px] group max-w-[300px] mx-auto"
    >
      {data.poster_path || data.backdrop_path ? (
        <img
          src={
            data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
          }
          alt={data.title || data.name || "Trending Item"}
          className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-[#1F1E24] flex items-center justify-center">
          <img
            src="/noImage.jpeg"
            alt="No image available"
            className="w-full h-full object-contain p-4"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t select-none from-black via-black/40 to-transparent p-2 sm:p-3 flex flex-col justify-end opacity-100 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-xs sm:text-sm font-bold text-white truncate">
          {data.title || data.name}
        </h2>
        <p className="text-xs text-gray-300 leading-tight mt-1 line-clamp-3 sm:line-clamp-4">
          {shortOverview}
        </p>

        {!hideDetails && (
          <div className="flex items-center select-none space-x-1 mt-1">
            <i
              className={`${
                mediaType === "movie"
                  ? "ri-movie-2-fill text-red-400"
                  : mediaType === "tv"
                  ? "ri-tv-fill text-blue-400"
                  : "ri-user-fill text-green-400"
              } text-xs sm:text-sm`}
            ></i>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
              {mediaType}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default Cards;
