import { Route, Routes } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Home from "./components/Home";
import Movie from "./components/Movie";
import People from "./components/People";
import Popular from "./components/Popular";
import MovieDetails from "./components/templates/MovieDetails";
import NotFound from "./components/templates/NotFound";
import PeopleDetails from "./components/templates/PeopleDetails";
import Trailer from "./components/templates/Trailer";
import TvDetails from "./components/templates/TvDetails";
import Trending from "./components/Trending";
import TVShows from "./components/TVShows";

function App() {
  return (
    <div className="bg-[#1F1E24] text-white w-screen h-screen overflow-x-hidden relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/movies" element={<Movie />} />

        <Route path="/movies/details/:id" element={<MovieDetails />}>
          <Route path="trailer" element={<Trailer />} />
        </Route>

        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/tv-shows/details/:id" element={<TvDetails />}>
          <Route path="trailer" element={<Trailer />} />
        </Route>

        <Route path="/peoples" element={<People />} />
        <Route path="/peoples/details/:id" element={<PeopleDetails />} />

        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="/notfound" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
