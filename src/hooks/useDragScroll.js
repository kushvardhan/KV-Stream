import { useRef, useEffect } from 'react';

/**
 * Hook to enable drag-to-scroll functionality for horizontal scrolling containers
 * @returns {Object} ref - Reference to attach to the scrollable container
 */
const useDragScroll = () => {
  const ref = useRef(null);
  
  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    
    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active');
    };
    
    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active');
    };
    
    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };
    
    // Touch events
    const handleTouchStart = (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    
    const handleTouchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };
    
    // Add event listeners
    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);
    
    // Touch events
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchend', handleMouseUp, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Clean up
    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
      
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleMouseUp);
      slider.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  return { ref };
};

export default useDragScroll;
