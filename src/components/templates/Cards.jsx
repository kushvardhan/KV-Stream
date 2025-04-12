import React, { memo } from "react";
import { Link } from "react-router-dom";

// Use memo to prevent unnecessary re-renders
const Cards = memo(
  ({ data, category, title }) => {
    // Determine the media type with proper fallbacks
    const mediaType = data.media_type || title || category || "movie";

    // Don't show description for people
    const isPerson = mediaType === "person" || mediaType === "people";

    const shortOverview = isPerson
      ? "" // Empty string for people
      : data.overview
      ? data.overview.split(" ").slice(0, 18).join(" ") + "..."
      : "No description available.";

    const getPath = () => {
      // Handle different media type formats
      if (mediaType === "movie" || mediaType === "movies") {
        return `/movies/details/${data.id}`;
      } else if (mediaType === "tv" || mediaType === "tv-shows") {
        return `/tv-shows/details/${data.id}`;
      } else if (mediaType === "person" || mediaType === "people") {
        return `/peoples/details/${data.id}`;
      } else {
        // Default fallback
        return `/movies/details/${data.id}`;
      }
    };

    return (
      <Link
        to={getPath()}
        className="relative rounded-lg shadow-md transition-transform duration-300 hover:scale-105 w-full h-[280px] sm:h-[300px] md:h-[330px] lg:h-[350px] group max-w-[280px] mx-auto"
      >
        {data.poster_path || data.backdrop_path || data.profile_path ? (
          <img
            src={
              data.poster_path
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                : data.profile_path
                ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
                : `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
            }
            alt={data.title || data.name || "Trending Item"}
            className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1F1E24] to-[#2c2c2c] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-white p-4">
              <i
                className={`${
                  mediaType === "movie" || mediaType === "movies"
                    ? "ri-movie-2-fill text-red-400"
                    : mediaType === "tv" || mediaType === "tv-shows"
                    ? "ri-tv-2-fill text-blue-400"
                    : mediaType === "person" || mediaType === "people"
                    ? "ri-user-fill text-green-400"
                    : "ri-film-fill text-purple-400"
                } text-5xl mb-4 animate-ping-slow`}
              ></i>
              <p className="text-sm text-center text-gray-300">
                No Image Available
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t select-none from-black via-black/40 to-transparent p-2 sm:p-3 flex flex-col justify-end opacity-100 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <h2 className="text-xs sm:text-sm font-bold text-white truncate">
            {data.title || data.name}
          </h2>
          {!isPerson && (
            <div className="h-[60px] overflow-hidden">
              <p className="text-xs text-gray-300 leading-tight mt-1 line-clamp-3 sm:line-clamp-4">
                {shortOverview}
              </p>
            </div>
          )}

          <div className="flex items-center select-none space-x-1 mt-1">
            <i
              className={`${
                mediaType === "movie" || mediaType === "movies"
                  ? "ri-movie-2-fill text-red-400"
                  : mediaType === "tv" || mediaType === "tv-shows"
                  ? "ri-tv-2-fill text-blue-400"
                  : mediaType === "person" || mediaType === "people"
                  ? "ri-user-fill text-green-400"
                  : "ri-film-fill text-purple-400"
              } text-xs sm:text-sm`}
            ></i>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
              {mediaType === "movies"
                ? "movie"
                : mediaType === "tv-shows"
                ? "tv"
                : mediaType === "people"
                ? "person"
                : mediaType}
            </p>
          </div>
        </div>
      </Link>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the data ID changes
    return prevProps.data.id === nextProps.data.id;
  }
);

export default Cards;
