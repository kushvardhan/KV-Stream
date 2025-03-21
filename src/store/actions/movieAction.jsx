import axios from '../../../utils/axios';
import { loadMovies } from '../reducers/movieSlice';

export const asyncloadmovies = (id) => async (dispatch) => {
  try {
    const detail = await axios.get(`/movie/${id}`);
    const externalid = await axios.get(`/movie/${id}/external_ids`);
    const recommendations = await axios.get(`/movie/${id}/recommendations`);
    const similar = await axios.get(`/movie/${id}/similar`);
    const videos = await axios.get(`/movie/${id}/videos`);
    const watchProvider = await axios.get(`/movie/${id}/watch/providers`);
    const credits = await axios.get(`/movie/${id}/credits`);
    const translations = await axios.get(`/movie/${id}/translations`);
    const reviews = await axios.get(`/movie/${id}/reviews`);
    const images = await axios.get(`/movie/${id}/images`);

    let ultimateData = {
        details: detail.data,
        externalid: externalid.data,
        recommendation: recommendations.data.results,
        similar: similar.data.results,
        videos: videos.data.results.find(v => v.type === 'Trailer'),
        watchProvider: watchProvider.data.results.IN,
        translations: translations.data.translations.map((t) => ({
          language: t.english_name,
          native: t.name
        })),
        credit: credits.data,
        reviews: reviews.data,
        images: images.data
      }

    dispatch(loadMovies(ultimateData));
  } catch (error) {
    console.error(error);
  }
};