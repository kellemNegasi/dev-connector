import { SET_CURRENT_USER } from "../actions/types";
const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
export default setCurrentUser;
