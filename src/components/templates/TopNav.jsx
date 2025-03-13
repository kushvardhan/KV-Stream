import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import noImage from '../../../public/noImage.png';
import instance from "../../../utils/axios";

const TopNav = () => {
  const [searchBar, setSearchBar] = useState("");
  const [searches, setSearches] = useState(null);

  const getSearches = async () => {
    try {
      const { data } = await instance.get(`/search/multi?query=${searchBar}`);
      console.log(data.results);
      setSearches(data.results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSearches();
  }, [searchBar]);

  return (
    <div className="w-full h-[10vh] relative px-4 py-3 flex items-center justify-center">
      <i className="ri-search-line text-zinc-300 text-2xl mt-3"></i>
      <input
        value={searchBar}
        onChange={(e) => setSearchBar(e.target.value)}
        type="text"
        className={`border-[1px] border-zinc-600 bg-zinc-800 w-[50%] mt-3 ml-5 mr-1 p-2 px-5 outline-none transition-all duration-300 ${
          searchBar ? "rounded-r-md rounded-l-full" : "rounded-full"
        }`}
        placeholder="Search.."
      />
      <i
        onClick={() => setSearchBar("")}
        className={`ri-close-line text-xl px-1 py-1 rounded-full hover:bg-zinc-700 text-zinc-200 mt-3 cursor-pointer transition-all duration-300 ${
          searchBar ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      ></i>

      <div
        className={`absolute w-[60%] h-[55vh] rounded-lg overflow-y-auto overflow-x-hidden bg-zinc-600 top-[90%] transition-all duration-300 ${
          searchBar
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        {searches &&
          searches.map((s, i) => (
            <Link
              key={i}
              className="inline-block w-full py-5 px-7 bg-zinc-300 text-zinc-700 font-semibold border-b-[1px] border-zinc-500 duration-300 transform transition-all hover:scale-101 hover:bg-zinc-200 hover:text-zinc-900"
            >
              <div className="flex items-center justify-start gap-2">
                <img
                  className="w-17 h-16 object-cover rounded transition-transform duration-300 shadow-lg"
                  src={s.poster_path || s.profile_path || s.backdrop_path || s.still_path || s.file_path || s.logo_path ? `https://image.tmdb.org/t/p/w500${s.poster_path || s.profile_path || s.backdrop_path || s.still_path || s.file_path || s.logo_path}` : noImage}    
                  alt=""
                /> 
                <h3 className="transition-opacity duration-300 opacity-100">
                  {s.title || s.original_title || s.name || s.original_name}
                </h3>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default TopNav;