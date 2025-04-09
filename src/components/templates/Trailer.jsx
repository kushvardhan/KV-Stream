import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";

const Trailer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const category = pathname.includes("movie") ? "movie" : "tv";
  const ytvideo = useSelector((state) => state[category].info.videos);
  const [isLoading, setIsLoading] = React.useState(true);

  ytvideo && ytvideo.name && (document.title = "KV Stream | " + ytvideo.name);

  // Handle close button click with multiple fallbacks
  const handleClose = () => {
    console.log("Close button clicked");
    try {
      // Try to navigate back first
      navigate(-1);

      // If we're still here after a short delay, try other methods
      setTimeout(() => {
        // Extract the base URL without the trailer part
        const baseUrl = pathname.split("/trailer")[0];
        console.log("Fallback navigation to:", baseUrl);
        navigate(baseUrl);
      }, 100);
    } catch (error) {
      console.error("Navigation error:", error);
      // Last resort: go to home
      navigate("/");
    }
  };

  return (
    <div className="fixed z-[100] top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.9)] text-white flex items-center justify-center">
      {/* Close button with overlay to ensure visibility */}
      <div className="absolute top-0 right-0 z-[999] p-2 sm:p-3 bg-gradient-to-bl from-black/80 via-black/50 to-transparent w-20 h-20 flex items-start justify-end">
        <button
          onClick={handleClose}
          className="p-2 sm:p-3 rounded-full cursor-pointer hover:bg-zinc-700 transition bg-black/80 border-2 border-white/40 shadow-lg flex items-center justify-center min-w-[40px] min-h-[40px]"
        >
          <i className="ri-close-line text-white text-2xl sm:text-3xl"></i>
        </button>
      </div>

      {ytvideo ? (
        <div className="w-full h-full sm:w-[90%] sm:h-[85%] flex items-center justify-center pt-10 sm:pt-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${ytvideo.key}`}
            width="100%"
            height="100%"
            controls
            playing={true}
            style={{ maxHeight: "calc(100% - 20px)", maxWidth: "100%" }}
            config={{
              youtube: {
                playerVars: { modestbranding: 1 },
              },
            }}
            onReady={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Trailer;
