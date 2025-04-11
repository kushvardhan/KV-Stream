import React from "react";

const NoImagePlaceholder = ({ type = "movie" }) => {
  // Get the appropriate icon based on content type
  const getIcon = () => {
    const normalizedType = type.toLowerCase();

    if (normalizedType === "movie" || normalizedType === "movies") {
      return "ri-movie-2-fill";
    } else if (normalizedType === "tv" || normalizedType === "tv-shows") {
      return "ri-tv-2-fill";
    } else if (normalizedType === "person" || normalizedType === "people") {
      return "ri-user-fill";
    } else {
      return "ri-film-fill";
    }
  };

  // Get the appropriate color based on content type
  const getIconColor = () => {
    const normalizedType = type.toLowerCase();

    if (normalizedType === "movie" || normalizedType === "movies") {
      return "text-red-400";
    } else if (normalizedType === "tv" || normalizedType === "tv-shows") {
      return "text-blue-400";
    } else if (normalizedType === "person" || normalizedType === "people") {
      return "text-green-400";
    } else {
      return "text-purple-400";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#6556CD] to-[#1F1E24] text-white">
      <i
        className={`${getIcon()} ${getIconColor()} text-5xl mb-4 animate-ping-slow`}
      ></i>
      <div className="text-center px-4">
        <p className="text-sm sm:text-base opacity-80">No Image Available</p>
        <p className="text-xs mt-1 opacity-60">KV Stream</p>
      </div>
    </div>
  );
};

export default NoImagePlaceholder;
