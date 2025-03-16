import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./reducers/movieSlice";
import tvReducer from "./reducers/tvSlice";
import peopleReducer from "./reducers/peopleSlice";


export const store = configureStore({
    reducer: {
      movie: moviesReducer,
      tv: tvReducer,
      people: peopleReducer,
    },
  });


  export default store;
