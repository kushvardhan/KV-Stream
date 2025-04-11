import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { asyncloadmovies } from "../../store/actions/movieAction";
import { removeMovie } from "../../store/reducers/movieSlice";
import HorizontalCard from "./HorizontalCard";
import Shimmer from "./Shimmer";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { info } = useSelector((state) => state.movie);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  info;
  useEffect(() => {
    dispatch(asyncloadmovies(id));
    return () => {
      dispatch(removeMovie());
    };
  }, [dispatch, id]);

  if (!info) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
        <Shimmer />
      </div>
    );
  }

  const popUpVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: index * 0.15, duration: 0.5 },
    }),
  };

  const displayedTranslations = showAllLanguages
    ? info.translations
    : info.translations.slice(0, 6);

  return (
    <div
      className="w-screen min-h-screen relative p-3 sm:p-4 md:p-6 flex flex-col items-center overflow-x-hidden details-page"
      style={{
        background: `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.5), rgba(0,0,0,.8)), url(${
          info.details.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280/${info.details.backdrop_path}`
            : "https://images.unsplash.com/photo-1554791756-6d6cb6b45d5d?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        })`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
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

        <div className="flex items-center gap-4">
          <a
            href={`https://www.wikidata.org/wiki/${info.externalid.wikidata_id}`}
            target="_blank"
            className="ri-earth-fill text-xl hover:scale-110"
            title="Wikipedia"
          ></a>

          {info.details.homepage && (
            <a
              href={info.details.homepage}
              target="_blank"
              className="ri-home-8-fill text-xl hover:scale-110"
              title="HomePage"
            ></a>
          )}

          {info.externalid.imdb_id && (
            <a
              href={`https://www.imdb.com/title/${info.externalid.imdb_id}`}
              target="_blank"
              className="text-xl hover:scale-110"
              title="IMDB"
            >
              IMDB
            </a>
          )}
        </div>
      </motion.nav>

      <motion.div
        className="flex flex-col sm:flex-row flex-wrap md:flex-nowrap p-2 sm:p-4 justify-start items-center sm:items-start gap-4 sm:gap-6 mt-4 sm:mt-8 w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {info.details.poster_path || info.details.backdrop_path ? (
          <motion.div
            className="h-[40vh] sm:h-[45vh] md:h-[50vh] max-w-full sm:max-w-[200px] md:max-w-[250px] rounded-lg shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              className="w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/w500/${
                info.details.poster_path || info.details.backdrop_path
              }`}
              alt={info.details.title}
              loading="lazy"
            />
          </motion.div>
        ) : null}
        <motion.div
          className="flex-1 text-white space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 bg-black/30 rounded-lg shadow-lg relative overflow-hidden w-full sm:w-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">
            {info.details.title ||
              info.details.original_name ||
              info.details.original_title}
            <small className="ml-2 text-base sm:text-xl md:text-2xl text-gray-400">
              ({info.details.release_date.split("-")[0]})
            </small>
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-zinc-300 text-sm sm:text-base md:text-lg">
            {info.details.vote_average > 0 && (
              <div className="flex items-center gap-2 select-none">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="20"
                      fill="transparent"
                      stroke="gray"
                      strokeWidth="5"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="20"
                      fill="transparent"
                      stroke="limegreen"
                      strokeWidth="5"
                      strokeDasharray="125"
                      strokeDashoffset={`${
                        125 - info.details.vote_average * 12.5
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold leading-none">
                    {info.details.vote_average.toFixed(1)}
                  </span>
                </div>
                <span className="font-semibold text-sm leading-none">
                  User Score
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 select-none bg-gray-700 px-3 text-sm py-1 rounded-lg shadow-md">
              <i className="ri-calendar-2-line text-xl text-indigo-400"></i>
              <span className="font-medium">Released:</span>
              <span>{info.details.release_date}</span>
            </div>

            <div className="flex flex-wrap gap-2 select-none">
              {info.details.genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-indigo-600 px-2 py-1 rounded-md text-white text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 select-none bg-gray-700 px-4 py-1 text-sm rounded-lg shadow-md">
              <i className="ri-time-line text-md text-yellow-400"></i>
              <span className="font-medium">Duration:</span>
              <span>{info.details.runtime} min</span>
            </div>
          </div>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {info.details.overview}
          </p>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            className="relative px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                       font-medium text-sm sm:text-base tracking-wide transition-all duration-200
                       backdrop-blur-sm bg-opacity-20 shadow-md border border-white/10
                       hover:bg-opacity-40 cursor-pointer"
            onClick={() => navigate(`/movies/details/${id}/trailer`)}
          >
            🎬 Watch Trailer
          </motion.button>
        </motion.div>
      </motion.div>

      {info.watchProvider && (
        <motion.div
          className="mt-8 w-[80%] p-4 bg-black/50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {info.watchProvider.flatrate?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg select-none font-semibold text-zinc-400 mb-4">
                Available on Platforms:
              </h2>
              <div className="flex flex-wrap gap-4">
                {info.watchProvider.flatrate.map((provider, index) => (
                  <motion.img
                    key={`${provider.provider_id}-${index}`}
                    title={provider.provider_name}
                    className="w-[5vw] h-[5vw] object-cover rounded-md"
                    src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                    alt={provider.provider_name}
                    variants={popUpVariant}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  />
                ))}
              </div>
            </div>
          )}

          {info.watchProvider.rent?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg select-none font-semibold text-zinc-400 mb-4">
                Available for Rent:
              </h2>
              <div className="flex flex-wrap gap-4">
                {info.watchProvider.rent.map((provider, index) => (
                  <motion.img
                    key={`${provider.provider_id}-${index}`}
                    title={provider.provider_name}
                    className="w-[5vw] h-[5vw] object-cover rounded-md"
                    src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                    alt={provider.provider_name}
                    variants={popUpVariant}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  />
                ))}
              </div>
            </div>
          )}

          {info.watchProvider.buy?.length > 0 && (
            <div>
              <h2 className="text-lg select-none font-semibold text-zinc-400 mb-4">
                Available to Buy:
              </h2>
              <div className="flex flex-wrap gap-4">
                {info.watchProvider.buy.map((provider, index) => (
                  <motion.img
                    key={`${provider.provider_id}-${index}`}
                    title={provider.provider_name}
                    className="w-[5vw] h-[5vw] object-cover rounded-md"
                    src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                    alt={provider.provider_name}
                    variants={popUpVariant}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        className="mt-8 w-[80%] p-4 bg-black/50 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-zinc-400 mb-4">
          Available Translations:
        </h2>
        <div className="flex flex-wrap gap-4">
          {displayedTranslations.map((lang, index) => (
            <span
              key={index}
              className="bg-[#6556CD] px-3 py-1 text-white text-sm rounded-md shadow-md"
            >
              {lang.language} ({lang.native})
            </span>
          ))}
        </div>
        {info.translations.length > 6 && (
          <button
            className="mt-4 px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600"
            onClick={() => setShowAllLanguages(!showAllLanguages)}
          >
            {showAllLanguages ? "Show Less" : "Show All"}
          </button>
        )}
      </motion.div>

      {info.similar?.length > 0 && (
        <div className="mt-8 w-[95%] p-4 bg-black/50 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-400 mb-1">
            🔥 Similar{" "}
          </h2>
          <HorizontalCard trending={info.similar} />
        </div>
      )}

      {info.recommendation?.length > 0 && (
        <div className="mt-8 w-[95%] p-4 bg-black/50 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-400 mb-1">
            🎥 Recommendation
          </h2>
          <HorizontalCard trending={info.recommendation.slice(0, 12)} />
        </div>
      )}

      <div className="my-8"></div>

      {info.credit?.cast?.filter((actor) => actor.profile_path).length > 0 && (
        <div className="mt-8 w-[95%] p-4 bg-black/50 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-400 mb-1">🎭 Cast</h2>
          <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-track-zinc-700 scrollbar-thumb-zinc-500 scroll-smooth p-2">
            {info.credit.cast
              .filter((actor) => actor.profile_path)
              .slice(0, 10)
              .map((actor, index) => (
                <Link
                  key={`${actor.id}-${index}`}
                  to={`/peoples/details/${actor.id}`}
                  className="group min-w-[160px]"
                >
                  <div className="relative w-[160px] h-[240px] rounded-xl overflow-hidden bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-300"
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                      <h2 className="text-sm font-semibold text-white truncate">
                        {actor.name}
                      </h2>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {info.credit?.crew?.filter((member) => member.profile_path).length >
        0 && (
        <div className="mt-8 w-[95%] p-4 bg-black/50 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-400 mb-1">🎬 Crew</h2>
          <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-track-zinc-700 scrollbar-thumb-zinc-500 scroll-smooth p-2">
            {info.credit.crew
              .filter((member) => member.profile_path)
              .slice(0, 10)
              .map((member, index) => (
                <Link
                  key={`${member.id}-${index}`}
                  to={`/peoples/details/${member.id}`}
                  className="group min-w-[160px]"
                >
                  <div className="relative w-[160px] h-[240px] rounded-xl overflow-hidden bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                      alt={member.name}
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-300"
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                      <h2 className="text-sm font-semibold text-white truncate">
                        {member.name}
                      </h2>
                      <p className="text-xs text-gray-400">{member.job}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default MovieDetails;
