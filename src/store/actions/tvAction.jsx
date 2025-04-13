import axios from "../../../utils/axios";
import { loadtv } from "../reducers/tvSlice";

export const asyncLoadtv = (id) => async (dispatch) => {
  try {
    // Check if id is valid
    if (!id) {
      throw new Error("Invalid TV show ID");
    }

    // Make all API requests
    const detail = await axios.get(`/tv/${id}`);
    const externalid = await axios.get(`/tv/${id}/external_ids`);
    const recommendations = await axios.get(`/tv/${id}/recommendations`);
    const similar = await axios.get(`/tv/${id}/similar`);
    const videos = await axios.get(`/tv/${id}/videos`);
    const watchProvider = await axios.get(`/tv/${id}/watch/providers`);
    const credits = await axios.get(`/tv/${id}/credits`);
    const translations = await axios.get(`/tv/${id}/translations`);
    const reviews = await axios.get(`/tv/${id}/reviews`);
    const images = await axios.get(`/tv/${id}/images`);

    // Check if we got valid data
    if (!detail.data) {
      throw new Error("No TV show data found");
    }

    let ultimateData = {
      details: detail.data,
      externalid: externalid.data,
      recommendation: recommendations.data.results,
      similar: similar.data.results,
      videos: videos.data.results.find((v) => v.type === "Trailer"),
      watchProvider: watchProvider.data.results.IN,
      translations: translations.data.translations.map((t) => ({
        language: t.english_name,
        native: t.name,
      })),
      credit: credits.data,
      reviews: reviews.data,
      images: images.data,
    };

    console.log("TV details loaded successfully");
    dispatch(loadtv(ultimateData));
    return ultimateData; // Return data for async/await in component
  } catch (error) {
    console.error("Error loading TV show data:", error);
    throw error; // Re-throw to allow component to catch it
  }
};
