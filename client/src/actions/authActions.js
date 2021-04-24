import axios from "axios";
// set the type and the action funtions
import { GET_ERRORS } from "./types";
export const registerUser = (userData,history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push('/login'))
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};
