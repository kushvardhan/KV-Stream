import React from "react";

const Shimmer = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-0">
      {Array(8)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            className="bg-[#2D2B37] p-2 sm:p-4 rounded-md animate-pulse"
          >
            <div className="h-20 sm:h-24 bg-[#3A3844] rounded-md"></div>
            <div className="mt-2 h-3 sm:h-4 bg-[#3A3844] rounded w-3/4"></div>
            <div className="mt-1 h-2 sm:h-3 bg-[#3A3844] rounded w-1/2"></div>
          </div>
        ))}
    </div>
  );
};

export default Shimmer;
