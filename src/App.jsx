import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Trending from "./components/Trending";
import Popular from "./components/Popular";
import Movie from "./components/Movie";
import TVShows from "./components/TVShows";
import People from "./components/People";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/AboutUs";
import MovieDetails from "./components/templates/MovieDetails";
import TvDetails from "./components/templates/TvDetails";
import PeopleDetails from "./components/templates/PeopleDetails";

function App() {
  return (
    <div className="bg-[#1F1E24] text-white w-screen h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/popular" element={<Popular />} />
        
        <Route path="/movies" element={<Movie />} />
        <Route path="/movies/details/:id" element={<MovieDetails />} />
        
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/tv-shows/details/:id" element={<TvDetails />} />
        
        <Route path="/peoples" element={<People />} />
        <Route path="/peoples/details/:id" element={<PeopleDetails />} />
        
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </div>
  );
}

export default App;
