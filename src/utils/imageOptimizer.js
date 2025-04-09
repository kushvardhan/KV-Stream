/**
 * Optimizes image loading by providing a placeholder and lazy loading
 * @param {string} src - The source URL of the image
 * @param {string} alt - Alt text for the image
 * @param {string} className - CSS classes for the image
 * @param {function} onLoad - Optional callback function when image loads
 * @returns {JSX.Element} - The optimized image element
 */
import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ src, alt, className, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate a low-quality placeholder
  const placeholderSrc = src ? `${src.split('original').join('w92')}` : null;
  
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };
  
  // Preload the actual image
  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleError;
      
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [src]);
  
  if (error) {
    return (
      <div className={`${className} bg-zinc-800 flex items-center justify-center`}>
        <span className="text-zinc-500 text-sm">Image not available</span>
      </div>
    );
  }
  
  return (
    <div className={`${className} relative overflow-hidden`}>
      {!isLoaded && placeholderSrc && (
        <img 
          src={placeholderSrc} 
          alt={alt} 
          className={`${className} absolute inset-0 blur-sm scale-105 transition-opacity duration-300`}
          style={{ opacity: isLoaded ? 0 : 1 }}
        />
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`${className} transition-opacity duration-500`}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage;
