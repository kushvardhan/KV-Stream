import React from "react";

const Shimmer = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array(8).fill("").map((_, index) => (
                <div key={index} className="bg-[#2D2B37] p-4 rounded-md animate-pulse">
                    <div className="h-24 bg-[#3A3844] rounded-md"></div>
                    <div className="mt-2 h-4 bg-[#3A3844] rounded w-3/4"></div>
                </div>
            ))}
        </div>
    );
};

export default Shimmer;
