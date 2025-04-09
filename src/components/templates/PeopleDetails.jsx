import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { asyncloadpeople } from "../../store/actions/peopleAction";
import { removePeople } from "../../store/reducers/peopleSlice";
import Shimmer from "./Shimmer";
import noImage from "/noImage.jpeg";

const PeopleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { info } = useSelector((state) => state.people);
  const [showFullBio, setShowFullBio] = useState(false);
  "people: " + info;

  // State for active tab
  const [activeTab, setActiveTab] = useState("movie");

  useEffect(() => {
    dispatch(asyncloadpeople(id));
    return () => {
      dispatch(removePeople());
    };
  }, [dispatch, id]);

  if (!info) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
        <Shimmer />
      </div>
    );
  }

  const bioText = info.details.biography || "";
  const truncatedBio = bioText.split(" ").slice(0, 50).join(" ") + "...";

  const HorizontalCardForPeople = ({ data }) => {
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
    }, [data]);

    useEffect(() => {
      const handleScroll = () => checkScroll();
      if (scrollRef.current) {
        scrollRef.current.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    }, []);

    const scroll = (direction) => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = 200;
        current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
        setTimeout(checkScroll, 100);
      }
    };

    return (
      <div className="w-full h-auto p-3 relative mt-1">
        <div className="mb-4"></div>

        {showLeftButton && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-zinc-700/50 hover:bg-zinc-600 text-white p-2 rounded-full transition-all duration-300"
          >
            <i className="ri-arrow-left-s-line text-2xl"></i>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-hidden overflow-x-scroll space-x-4 scrollbar-thin scrollbar-track-zinc-700 scrollbar-thumb-zinc-500 scroll-smooth"
        >
          {data?.map((item, index) => {
            const isMovie = item.media_type === "movie";
            const detailsPath = isMovie
              ? `/movies/details/${item.id}`
              : `/tv-shows/details/${item.id}`;
            const iconType = isMovie ? "ri-movie-2-fill" : "ri-tv-fill";
            const iconColor = isMovie ? "text-red-400" : "text-blue-400";

            return (
              <Link key={index} to={detailsPath} className="group">
                <div className="relative w-[180px] min-w-[180px] h-[220px] rounded-lg overflow-hidden bg-zinc-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={
                      item.poster_path || item.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${
                            item.poster_path || item.backdrop_path
                          }`
                        : noImage
                    }
                    alt={
                      item.title ||
                      item.name ||
                      item.original_title ||
                      item.original_name
                    }
                    className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                    <h2 className="text-sm md:text-base font-semibold text-white truncate">
                      {item.title ||
                        item.name ||
                        item.original_title ||
                        item.original_name}
                    </h2>
                    <div className="flex items-center select-none space-x-1 mt-1">
                      <i className={`${iconType} text-sm ${iconColor}`}></i>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                        {item.media_type || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {showRightButton && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-zinc-700/50 hover:bg-zinc-600 text-white p-2 rounded-full transition-all duration-300"
          >
            <i className="ri-arrow-right-s-line text-2xl"></i>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-screen min-h-screen px-3 sm:px-4 md:px-[8%] py-3 sm:py-6 bg-[#1F1E24] text-white overflow-x-hidden">
      <motion.nav
        className="w-full flex justify-between items-center p-2 sm:p-3 md:p-4 bg-black/30 rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-zinc-400 hover:text-indigo-400 transition-all duration-300 w-10 h-10 flex items-center justify-center bg-[#2c2c2c] rounded-full shadow-md"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>
      </motion.nav>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-6">
        <div className="flex flex-col w-full md:w-[35%] items-center md:items-start gap-10">
          <div className="w-full flex flex-col items-center">
            <motion.img
              className="w-full max-w-[200px] sm:max-w-xs md:max-w-sm rounded-lg shadow-lg select-none object-cover"
              src={
                info.details.profile_path || info.details.poster_path
                  ? `https://image.tmdb.org/t/p/original/${
                      info.details.profile_path || info.details.poster_path
                    }`
                  : noImage
              }
              alt={info.details.name}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <hr className="mt-7 mb-5 border-none h-[2px] bg-zinc-500 w-full" />

            <div className="text-md flex items-center gap-3 sm:gap-4 md:gap-6 flex-wrap justify-center md:justify-start">
              {info.externalid.facebook_id && (
                <a
                  title="facebook"
                  href={`https://www.facebook.com/${info.externalid.facebook_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-facebook-fill text-2xl sm:text-3xl transition-all hover:text-indigo-400"></i>
                </a>
              )}
              {info.externalid.instagram_id && (
                <a
                  title="instagram"
                  href={`https://www.instagram.com/${info.externalid.instagram_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-instagram-fill text-2xl sm:text-3xl transition-all hover:text-indigo-400"></i>
                </a>
              )}
              {info.externalid.twitter_id && (
                <a
                  title="twitter"
                  href={`https://twitter.com/${info.externalid.twitter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-twitter-fill text-2xl sm:text-3xl transition-all hover:text-indigo-400"></i>
                </a>
              )}
              {info.externalid.imdb_id && (
                <a
                  title="imdb"
                  href={`https://www.imdb.com/name/${info.details.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm sm:text-base md:text-lg font-bold transition-all hover:text-indigo-400">
                    IMDB
                  </span>
                </a>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-2 sm:space-y-3 bg-black/30 px-2 sm:px-3 py-3 sm:py-5 rounded-xl shadow-lg backdrop-blur-md"
          >
            {info.details.birthday && (
              <p className="text-zinc-400 text-xs sm:text-sm md:text-md flex flex-wrap gap-1 sm:gap-2 items-center">
                <strong className="text-indigo-400 text-xs sm:text-sm select-none hover:text-indigo-300 transition-all">
                  Birthday:
                </strong>
                <span className="text-xs sm:text-sm text-zinc-300 whitespace-normal break-words">
                  {info.details.birthday}
                </span>
              </p>
            )}

            {info.details.gender !== undefined && (
              <p className="text-zinc-400 text-md flex flex-wrap gap-2 items-center">
                <strong className="text-indigo-400 text-sm select-none hover:text-indigo-300 transition-all">
                  Gender:
                </strong>
                <span className="text-regular text-zinc-300 whitespace-normal break-words">
                  {info.details.gender === 1 ? "Female" : "Male"}
                </span>
              </p>
            )}

            {info.details.known_for_department && (
              <p className="text-zinc-400 text-md flex flex-wrap gap-2 items-center">
                <strong className="text-indigo-400 text-sm select-none hover:text-indigo-300 transition-all">
                  Profession:
                </strong>
                <span className="text-regular text-zinc-300 whitespace-normal break-words">
                  {info.details.known_for_department}
                </span>
              </p>
            )}

            {info.details.place_of_birth && (
              <p className="text-zinc-400 text-md flex flex-wrap gap-2 items-center">
                <strong className="text-indigo-400 text-sm select-none hover:text-indigo-300 transition-all">
                  Place of Birth:
                </strong>
                <span className="text-regular text-zinc-300 whitespace-normal break-words">
                  {info.details.place_of_birth}
                </span>
              </p>
            )}

            {info.details.deathday && (
              <p className="text-zinc-400 text-md flex flex-wrap gap-2 items-center">
                <strong className="text-indigo-400 text-sm select-none hover:text-indigo-300 transition-all">
                  Deathday:
                </strong>
                <span className="text-regular text-zinc-300 whitespace-normal break-words">
                  {info.details.deathday}
                </span>
              </p>
            )}

            {info.details.also_known_as?.length > 0 && (
              <div className="text-zinc-400 text-md">
                <strong className="text-indigo-400 text-sm hover:text-indigo-300 select-none transition-all">
                  Also Known As:
                </strong>
                <ul className="mt-2 space-y-1">
                  {info.details.also_known_as.map((name, index) => (
                    <motion.li
                      key={index}
                      className="text-regular text-zinc-300 whitespace-normal break-words"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      - {name}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        <div className="w-full md:w-[65%] min-h-screen bg-zinc-900 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6 rounded-lg shadow-lg">
          {info.details.name && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-300">
              {info.details.name}
            </h1>
          )}

          {bioText && (
            <motion.p
              className="text-xs sm:text-sm md:text-md select-none text-zinc-400 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <strong className="text-indigo-400">Biography:</strong>{" "}
              {showFullBio ? bioText : truncatedBio}
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="ml-2 text-blue-300 text-xs sm:text-sm hover:underline transition-all"
              >
                {showFullBio ? "Show Less" : "Show More"}
              </button>
            </motion.p>
          )}

          {info.combinedCredits.cast.length > 0 && (
            <div>
              <h1 className="ml-2 text-regular text-indigo-300 transition-all">
                Known for:{" "}
              </h1>
              <HorizontalCardForPeople data={info.combinedCredits.cast} />
            </div>
          )}

          <div className="w-full flex justify-between items-center mt-6">
            <h1 className="mt-5 text-xl text-zinc-400 font-semibold">Acting</h1>
          </div>

          <div className="list-disc text-zinc-400 w-full h-[60vh] mt-5 overflow-x-hidden p-5 overflow-y-auto shadow-xl shadow-[rgba(255,255,255,.3)] border-2 border-zinc-700 ">
            {info?.[category + "Credits"]?.cast?.length > 0 ? (
              info[category + "Credits"].cast.map((c, i) => (
                <li
                  key={i}
                  title="non-clickable"
                  className="hover:text-white hover:bg-[#222129] rounded-lg p-4 duration-300"
                >
                  <Link>
                    <span>
                      {c.name || c.title || c.original_name || c.original_title}
                    </span>
                    <span className="block">
                      Character: {c.character || "N/A"}
                    </span>
                  </Link>
                  <hr className="mt-4 b text-zinc-800" />
                </li>
              ))
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleDetails;
