import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS,
  POST_LOADING,
} from "../actions/types";
const initialState = {
  posts: [],
  post: {},
  loading: false,
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    default:
      return state;
  }
}
