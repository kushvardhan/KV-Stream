import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({ 
    name: "movie",
    initialState: {
        info: null,
    },
    reducers: {
        loadMovies: (state, action) => {
            state.info = action.payload;
        },
        removeMovie: (state, action) => {
            state.info = null;
        },
    },
 });

export const {loadMovies,removeMovie} = movieSlice.actions;
export default movieSlice.reducer;