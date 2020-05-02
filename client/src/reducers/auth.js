import {
  REGISTER_SUCCESS,
  REGISTER_FALIURE,
  LOGIN_SUCCESS,
  LOGIN_FALIURE,
} from "../actions/constants";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGIN_FALIURE:
      localStorage.removeItem("token");
      return {
        ...state,
        ...action.payload,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
}
