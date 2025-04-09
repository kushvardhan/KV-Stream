import React from "react";

const Shimmer = () => {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 p-2 sm:p-4 md:p-6 w-full">
      {Array(12)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            className="bg-[#2D2B37] p-2 sm:p-4 rounded-lg shadow-md animate-pulse h-[200px] sm:h-[250px] md:h-[300px] w-full"
          >
            <div className="h-[60%] bg-[#3A3844] rounded-md w-full"></div>
            <div className="mt-3 h-3 sm:h-4 bg-[#3A3844] rounded-md w-[85%]"></div>
            <div className="mt-2 h-2 sm:h-3 bg-[#3A3844] rounded-md w-[70%]"></div>
            <div className="mt-2 h-2 sm:h-3 bg-[#3A3844] rounded-md w-[40%]"></div>
          </div>
        ))}
    </div>
  );
};

export default Shimmer;
