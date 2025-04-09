import React, { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shimmer from "./Shimmer";

// Lazy load components that aren't immediately visible
const SimilarContent = lazy(() => import("./SimilarContent"));
const Cast = lazy(() => import("./Cast"));

// Image optimization component
const OptimizedImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate a low-quality placeholder
  const placeholderSrc = src ? `${src.split('original').join('w92')}` : null;
  
  if (error) {
    return (
      <div className={`${className} bg-zinc-800 flex items-center justify-center`}>
        <span className="text-zinc-500 text-sm">Image not available</span>
      </div>
    );
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && placeholderSrc && (
        <img 
          src={placeholderSrc} 
          alt={alt} 
          className={`absolute inset-0 blur-sm scale-105 transition-opacity duration-300 w-full h-full object-cover`}
          style={{ opacity: isLoaded ? 0 : 1 }}
        />
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`transition-opacity duration-500 w-full h-full object-cover`}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
};

// Helper functions
const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Export these utility functions for use in the details components
export { OptimizedImage, formatRuntime, formatCurrency, SimilarContent, Cast };
