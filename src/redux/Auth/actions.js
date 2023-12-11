import {
  GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, POST_SIGNIN_FAILURE, POST_SIGNIN_REQUEST, POST_SIGNIN_SUCCESS, SET_LOGIN_FAILURE, SET_LOGIN_REQUEST, SET_LOGIN_SUCCESS, SET_LOGOUT_REQUEST,
} from "./actionTypes";
import axios from "axios";

// signup actions
export const signupRequestAction =()=>({ type: POST_SIGNIN_REQUEST });

export const signupSuccessAction = () => {
  return { type: POST_SIGNIN_SUCCESS };
};

export const signupFailureAction = () => {
  return { type: POST_SIGNIN_FAILURE };
};

//login actions

export const userRequestAction = () => {
  return { type: GET_USER_REQUEST };
};

export const userSuccessAction = (payload) => {
  return { type: GET_USER_SUCCESS, payload };
};

export const userFailureAction = () => {
  return { type: GET_USER_FAILURE };
};

export const loginRequestAction = () => {
  return { type: SET_LOGIN_REQUEST };
};

export const loginSuccessAction = (payload) => {
  return { type: SET_LOGIN_SUCCESS, payload };
};

export const loginFailureAction = () => {
  return { type: SET_LOGIN_FAILURE };
};

export const setLogoutAction = () => {
  return { type: SET_LOGOUT_REQUEST };
};

// singup function

export const signup = (user) => async (dispatch) => {
  dispatch(signupRequestAction());
  user.created = Date();
  try {
    let res = await axios.post(`${process.env.REACT_APP_API}/users/add`, JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    })
    dispatch(signupSuccessAction());
    return res;
  } catch (error) {
    dispatch(signupFailureAction());
    throw error;
  }
};

export const login = (user) => async (dispatch) => {
  dispatch(loginRequestAction());
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/users/login`, JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(loginSuccessAction(user));
    return res;
  } catch (error) {
    dispatch(loginFailureAction());
    throw error;
  }
};

export const googleLogin = (user) => async (dispatch) => {
  dispatch(loginRequestAction());
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/users/googleLogin`, JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(loginSuccessAction(user));
    return res;
  } catch (error) {
    dispatch(loginFailureAction());
    throw error;
  }
};

export const setLogout = (dispatch) => {
  localStorage.removeItem("isAuth");
  localStorage.removeItem("token");
  // localStorage.removeItem("userId");
  localStorage.removeItem('isGoogleCalendarAuth');
  localStorage.removeItem('GoogleAuthTime')
  dispatch(setLogoutAction());
};

export const incrementScheduleCount = async () => {
  let token = localStorage.getItem('token');
  try {
    const res = await axios.patch(`${process.env.REACT_APP_API}/users/analyses`, null, { headers: { token } });
     console.log('res',res)
    return res;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
}
