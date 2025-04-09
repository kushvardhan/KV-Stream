import React from "react";

const Shimmer = () => {
  return (
    <div className="w-full min-h-screen bg-[#1F1E24] p-4 sm:p-6">
      {/* Header shimmer */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#2D2B37] animate-pulse"></div>
          <div className="h-6 w-40 ml-4 bg-[#2D2B37] rounded-md animate-pulse"></div>
        </div>
        <div className="w-32 h-10 bg-[#2D2B37] rounded-md animate-pulse"></div>
      </div>

      {/* Hero section shimmer */}
      <div className="w-full h-[30vh] sm:h-[40vh] bg-[#2D2B37] rounded-xl mb-8 animate-pulse relative overflow-hidden">
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-8 w-3/4 bg-[#3A3844] rounded-md mb-2 animate-pulse"></div>
          <div className="h-4 w-1/2 bg-[#3A3844] rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Section title shimmer */}
      <div className="h-7 w-48 bg-[#2D2B37] rounded-md mb-4 animate-pulse"></div>

      {/* Cards grid shimmer */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 mb-8">
        {Array(10)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="bg-[#2D2B37] rounded-lg shadow-md animate-pulse h-[200px] sm:h-[250px] md:h-[300px] w-full"
            >
              <div className="h-[70%] bg-[#3A3844] rounded-t-lg w-full"></div>
              <div className="p-2">
                <div className="mt-2 h-4 bg-[#3A3844] rounded-md w-[85%]"></div>
                <div className="mt-2 h-3 bg-[#3A3844] rounded-md w-[60%]"></div>
              </div>
            </div>
          ))}
      </div>

      {/* Categories shimmer */}
      <div className="h-7 w-48 bg-[#2D2B37] rounded-md mb-4 animate-pulse"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 mb-8">
        {Array(10)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="bg-[#2D2B37] rounded-lg animate-pulse h-24 sm:h-32 w-full flex flex-col items-center justify-center p-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#3A3844] mb-2"></div>
              <div className="h-3 w-16 bg-[#3A3844] rounded-md"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Shimmer;
