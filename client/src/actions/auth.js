import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FALIURE,
  LOGIN_SUCCESS,
  LOGIN_FALIURE,
} from "./constants";

export const register = ({ name, email, password, password2 }) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password, password2 });

  try {
    const res = await axios.post("/api/users/register", body, config);
    console.log(res);
    // dispatch({
    //   type: REGISTER_SUCCESS,
    //   payload: res.data,
    // });
  } catch (err) {
    if (err.respones.data.errors && err.respones.data.errors.length > 0) {
      console.log(err);
    }

    // dispatch({
    //   type: REGISTER_FALIURE,
    // });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });
  try {
    console.log("i was called");
    const res = await axios.post("/api/users/login", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    // if (err.respones.data.errors && err.respones.data.errors.length > 0) {
    // }
    dispatch({
      type: LOGIN_FALIURE,
    });
  }
};
