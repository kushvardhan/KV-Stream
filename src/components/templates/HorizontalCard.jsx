import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HorizontalCard = ({ trending }) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [trending]);

  useEffect(() => {
    const handleScroll = () => checkScroll();
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 100);
    }
  };

  return (
    <div className="w-full h-auto p-6 relative mt-3">
      <div className="mb-4">
      </div>

      {showLeftButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-zinc-700/50 hover:bg-zinc-600 text-white p-2 rounded-full transition-all duration-300"
        >
          <i className="ri-arrow-left-s-line text-2xl"></i>
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-hidden overflow-x-scroll space-x-4 scrollbar-thin scrollbar-track-zinc-700 scrollbar-thumb-zinc-500 scroll-smooth"
      >
        {trending?.map((item, index) => {
          const isMovie = item.media_type === "movie";
          const detailsPath = isMovie ? `/movies/details/${item.id}` : `/tv-shows/details/${item.id}`;
          const iconType = isMovie ? "ri-movie-2-fill" : "ri-tv-fill";
          const iconColor = isMovie ? "text-red-400" : "text-blue-400";

          return (
            <Link key={index} to={detailsPath} className="group">
              <div className="relative w-[180px] min-w-[180px] h-[320px] rounded-lg overflow-hidden bg-zinc-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name || item.original_title || item.original_name}
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-300"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                  <h2 className="text-sm md:text-base font-semibold text-white truncate">
                    {item.title || item.name || item.original_title || item.original_name}
                  </h2>
                  <div className="flex items-center select-none space-x-1 mt-1">
                    <i className={`${iconType} text-sm ${iconColor}`}></i>
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                      {item.media_type || ''}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showRightButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-zinc-700/50 hover:bg-zinc-600 text-white p-2 rounded-full transition-all duration-300"
        >
          <i className="ri-arrow-right-s-line text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default HorizontalCard;
