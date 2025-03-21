import axios from '../../../utils/axios';
import { loadPeople} from '../reducers/peopleSlice';

export const asyncloadpeople = (id) => async (dispatch) => {
  try {
    const detail = await axios.get(`/person/${id}`);
    const externalid = await axios.get(`/person/${id}/external_ids`);
    const combinedCredits = await axios.get(`/person/${id}/combined_credits`)
    const tvCredits = await axios.get(`/person/${id}/tv_credits`)
    const movieCredits = await axios.get(`/person/${id}/movie_credits`)
    

    let ultimateData = {
        details: detail.data,
        externalid: externalid.data,
        combinedCredits:combinedCredits.data,
        tvCredits:tvCredits.data,
        movieCredits:tvCredits.data,
      }
      console.log(ultimateData);
    dispatch(loadPeople(ultimateData));
  } catch (error) {
    console.error(error);
  }
};