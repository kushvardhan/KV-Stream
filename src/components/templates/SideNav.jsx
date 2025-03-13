import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import instance from "../../../utils/axios";

const SideNav = () => {


  return (
    <div className="w-[20%] h-full border-r border-zinc-400 py-8 px-4 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600 transition-all duration-300">
      <h1 className="flex items-center px-3 select-none">
        <i className="ri-tv-fill text-[#6556CD] text-center text-4xl"></i>
        <span className="text-3xl text-center font-bold ml-2 tracking-wide">KV.</span>
      </h1>
      <nav className="flex flex-col">
        <h1 className="text-2xl mt-8 mb-5 font-bold text-zinc-200 font-gilroy px-3">New Feeds</h1>
        <div className="text-md font-sans tracking-wide flex flex-col gap-2 text-zinc-300 ml-2 select-none">
          <Link className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2">
            <i className="ri-fire-fill text-xl mr-1"></i> Trending
          </Link>
          <Link className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2">
            <i className="ri-bard-fill text-xl mr-1"></i> Popular
          </Link>
          <Link className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2">
            <i className="ri-movie-2-fill text-xl mr-1"></i> Movies
          </Link>
          <Link className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2">
            <i className="ri-slideshow-3-fill text-xl mr-1"></i> TV Shows
          </Link>
          <Link className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2">
            <i className="ri-team-fill text-xl mr-1"></i> People
          </Link>
        </div>
      </nav>
      <hr className="my-6 border-zinc-500" />

      <nav className="flex flex-col">
        <h1 className="text-2xl mb-5 font-bold text-zinc-200 font-gilroy px-3">Web Info</h1>
        <div className="text-md font-sans tracking-wide flex flex-col gap-2 text-zinc-300 ml-2 select-none">
          <Link className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2">
            <i className="ri-file-info-fill text-xl mr-1"></i> About <span className="font-semibold">KV</span>
          </Link>
          <Link className="hover:bg-[#6556CD] hover:text-white duration-300 rounded-md p-2">
            <i className="ri-phone-fill text-xl mr-1"></i> Contact Us
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default SideNav;
