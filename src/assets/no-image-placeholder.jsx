import React from 'react';

const NoImagePlaceholder = ({ type = "movie" }) => {
  // Get the appropriate icon based on content type
  const getIcon = () => {
    switch(type.toLowerCase()) {
      case 'movie':
        return 'ri-film-fill';
      case 'tv':
        return 'ri-tv-2-fill';
      case 'person':
        return 'ri-user-fill';
      default:
        return 'ri-image-fill';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#6556CD] to-[#1F1E24] text-white">
      <i className={`${getIcon()} text-5xl mb-4`}></i>
      <div className="text-center px-4">
        <p className="text-sm sm:text-base opacity-80">No Image Available</p>
        <p className="text-xs mt-1 opacity-60">KV Stream</p>
      </div>
    </div>
  );
};

export default NoImagePlaceholder;
