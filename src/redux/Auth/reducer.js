import {POST_SIGNIN_FAILURE,POST_SIGNIN_REQUEST,POST_SIGNIN_SUCCESS,SET_LOGIN_FAILURE,SET_LOGIN_REQUEST,SET_LOGIN_SUCCESS,SET_LOGOUT_REQUEST,
} from "./actionTypes";

  let key = localStorage.getItem("isAuth")
  const initialState = {user:{},isAuth:key||false,isLoading: false,isError: false};
  
  export const reducer = (state = initialState, { type, payload }) => {
    switch (type){
      case POST_SIGNIN_REQUEST:return {...state,isLoading: true};
      case POST_SIGNIN_SUCCESS:return {...state,isLoading: false};
      case POST_SIGNIN_FAILURE:return {...state,isLoading: false, isError: true};
      case SET_LOGIN_REQUEST:return {...state,isLoading:true};
      case SET_LOGIN_SUCCESS:return {...state,isLoading:false,user:payload,isAuth:true};
      case SET_LOGIN_FAILURE:return {...state,isLoading:false,isError:true};
      case SET_LOGOUT_REQUEST:return {...state,isAuth:false};
      default:return state;
    }
  };