import React from "react";

const CategoryShimmer = () => {
  return (
    <div className="w-full min-h-screen bg-[#1F1E24] p-4 sm:p-6 pt-[12vh]">
      {/* Header shimmer */}
      <div className="w-full flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-[#2D2B37] animate-pulse mr-4"></div>
        <div className="h-8 w-48 bg-[#2D2B37] rounded-md animate-pulse"></div>
      </div>

      {/* Filter options shimmer */}
      <div className="w-full flex flex-wrap gap-3 mb-6">
        <div className="h-10 w-24 bg-[#2D2B37] rounded-md animate-pulse"></div>
        <div className="h-10 w-32 bg-[#2D2B37] rounded-md animate-pulse"></div>
        <div className="h-10 w-28 bg-[#2D2B37] rounded-md animate-pulse"></div>
      </div>

      {/* Cards grid shimmer */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
        {Array(18)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="bg-[#2D2B37] rounded-lg shadow-md animate-pulse h-[220px] sm:h-[260px] md:h-[300px] w-full"
            >
              <div className="h-[75%] bg-[#3A3844] rounded-t-lg w-full"></div>
              <div className="p-3">
                <div className="h-4 bg-[#3A3844] rounded-md w-[90%]"></div>
                <div className="mt-2 h-3 bg-[#3A3844] rounded-md w-[60%]"></div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination shimmer */}
      <div className="w-full flex justify-center mt-8">
        <div className="flex gap-2">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="h-10 w-10 bg-[#2D2B37] rounded-md animate-pulse"
              ></div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShimmer;
