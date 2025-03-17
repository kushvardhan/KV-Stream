import React from "react";
import { Link } from "react-router-dom";
import noImage from "/noImage.jpeg";

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
      className="relative rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 w-full sm:w-[200px] md:w-[220px] lg:w-[240px] h-[370px] group"
    >
      <img
        src={
          data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : data.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
            : noImage
        }
        alt={data.title || data.name || "Trending Item"}
        className="w-full h-full object-cover brightness-90 group-hover:brightness-120 transition-all duration-300"
      />

      <div className="absolute inset-0 bg-gradient-to-t select-none from-black via-black/40 to-transparent p-3 flex flex-col justify-end opacity-100 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-sm font-bold text-white truncate">
          {data.title || data.name}
        </h2>
        <p className="text-xs text-gray-300 leading-tight mt-1">
          {shortOverview}
        </p>

        {!hideDetails && (
          <div className="flex items-center select-none space-x-1 mt-1">
            <i
              className={`${
                mediaType === "movie"
                  ? "ri-movie-2-fill text-red-400"
                  : "ri-tv-fill text-blue-400"
              } text-sm`}
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
