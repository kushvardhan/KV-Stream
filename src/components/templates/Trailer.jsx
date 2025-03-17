import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NotFound from "./NotFound";

const Trailer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const category = pathname.includes("movie") ? "movie" : "tv";
  const ytvideo = useSelector((state) => state[category].info.videos);
  ytvideo && ytvideo.name && (document.title = "SCSDB | " + ytvideo.name);

return  (
    <div className="absolute z-[100] top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.8)] text-white flex items-center justify-center">
      <button
        onClick={() => navigate(-1)} 
        className="absolute top-5 right-5 p-2 rounded-full cursor-pointer hover:bg-zinc-700/50 transition"
      >
        <span className="text-zinc-300 text-lg font-bold">✖</span>
      </button>

      {
        ytvideo ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${ytvideo.key}`}
            width="90%"
            height="85%"
            controls
          />
        ) : (
          <NotFound />
        )
      }
    </div>
  ) 
};

export default Trailer;
