import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NotFound from "./NotFound";

const Trailer = () => {
  const { pathname } = useLocation();
  const { id } = useParams(); 
  const category = pathname.includes("movies") ? "movie" : "tv";
  const ytvideo = useSelector(state => state[category].info.videos); 
  const navigate = useNavigate();

  console.log("Full Redux State:", useSelector(state => state));
  console.log("ytvideo:", ytvideo); 
  console.log("ytvideo?.key:", ytvideo?.key);

  if (ytvideo == 'undefined') {
    return <NotFound/>;
  }

  if (!ytvideo || !ytvideo.key) {
    console.log("ytvideo is invalid:", ytvideo);
    return <NotFound />;
  }
  

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
            height="90%"
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
