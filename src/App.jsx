import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Shimmer from "./components/templates/Shimmer";

// Lazy load components
const Home = lazy(() => import("./components/Home"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const CategoryContent = lazy(() => import("./components/CategoryContent"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const Features = lazy(() => import("./components/Features"));
const Movie = lazy(() => import("./components/Movie"));
const People = lazy(() => import("./components/People"));
const Popular = lazy(() => import("./components/Popular"));
const MovieDetails = lazy(() => import("./components/templates/MovieDetails"));
const NotFound = lazy(() => import("./components/templates/NotFound"));
const PeopleDetails = lazy(() =>
  import("./components/templates/PeopleDetails")
);
const Trailer = lazy(() => import("./components/templates/Trailer"));
const TvDetails = lazy(() => import("./components/templates/TvDetails"));
const Trending = lazy(() => import("./components/Trending"));
const TVShows = lazy(() => import("./components/TVShows"));

function App() {
  // Add a global event listener for the sidebar toggle
  React.useEffect(() => {
    const handleToggleSidebar = () => {
      console.log("App: toggle-sidebar event received");
      // This is just to ensure the event is being received at the App level
    };

    window.addEventListener("toggle-sidebar", handleToggleSidebar);

    return () => {
      window.removeEventListener("toggle-sidebar", handleToggleSidebar);
    };
  }, []);

  return (
    <div className="bg-[#1F1E24] text-white w-screen h-screen overflow-x-hidden relative">
      <Suspense fallback={<Shimmer />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/movies" element={<Movie />} />
          <Route path="/category/:category" element={<CategoryContent />} />

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
          <Route path="/features" element={<Features />} />

          <Route path="/notfound" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
