import React, { useRef, useState, useEffect } from 'react';

const HorizontalScroll = ({ children, title }) => {
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
  }, [children]);

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
      const scrollAmount = 200;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 100);
    }
  };

  return (
    <div className="w-full h-auto p-3 relative mt-1">
      {title && <h1 className="text-2xl font-bold text-white mb-4 tracking-wide">{title}</h1>}

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
        {children}
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

export default HorizontalScroll;
