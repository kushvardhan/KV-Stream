import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmY2U2YTcxYTFhZTlhYTY0MGZjMTQ4YTE2ZDc5OWY1MSIsIm5iZiI6MTc0MTg5MzY1OC40NjgsInN1YiI6IjY3ZDMzMDFhNzA1ZDY4MzExNzNlMDhhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PtYHWe63t9xxRXc7Dwa8Qanu4Xs1WK6BIFozNiShFF0`
  }
});

export default instance;
