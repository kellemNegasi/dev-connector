import axios from "axios";
import {
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  GET_PROFILE,
  PROFILE_LOADING,
  SET_CURRENT_USER,
} from "./types";
// import { clearCurrentProfile } from "./profileActions";
// get current user's profile

export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("api/profile/")
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_PROFILE,
        payload: {},
      });
    });
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profile", profileData)
    .then((result) => {
      history.push("/dashboard");
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This can't be undone")) {
    axios
      .delete("api/profile")
      .then((res) => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        });
      })
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  }
};
