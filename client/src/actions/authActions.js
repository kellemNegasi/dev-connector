import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import setCurrentUser from "../utils/setCurrentUser";
// set the type and the action funtions
import { GET_ERRORS } from "./types";
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((error) => {
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      });
    });
};

// get user token

export const loginUser = (userData) => (dispatch) => {
  axios
    .post("api/users/login", userData)
    .then((res) => {
      // save token to local storage here
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // set the token to the auth header
      setAuthToken(token);
      //decode to get the user
      const decodedData = jwt_decode(token);
      // set current user
      const currentUser = setCurrentUser(decodedData);
      dispatch(currentUser);
      // dispatch(currentUser);
    })
    .catch((error) => {
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      });
    });
};
// export const setCurrentUser = (decoded) => {
//   return {
//     type: SET_CURRENT_USER,
//     payload: decoded,
//   };
// };
export const logoutUser = () => (dispatch) => {
  // remove jwt from local storage
  localStorage.removeItem("jwtToken");
  // remove auth header
  setAuthToken(false);
  // set the current user to any empty object
  dispatch(setCurrentUser({}));
};
