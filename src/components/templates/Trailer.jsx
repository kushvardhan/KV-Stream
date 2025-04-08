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
  ytvideo && ytvideo.name && (document.title = "SCSDB | " + ytvideo.name);

  return (
    <div className="fixed z-[100] top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.9)] text-white flex items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 sm:top-5 right-3 sm:right-5 p-2 rounded-full cursor-pointer hover:bg-zinc-700/50 transition z-[101]"
      >
        <span className="text-zinc-300 text-base sm:text-lg font-bold">✖</span>
      </button>

      {ytvideo ? (
        <div className="w-full h-full sm:w-[90%] sm:h-[85%] flex items-center justify-center">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${ytvideo.key}`}
            width="100%"
            height="100%"
            controls
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Trailer;
