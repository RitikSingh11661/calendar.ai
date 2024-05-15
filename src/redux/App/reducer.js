import { ADD_EVENTS_FAILURE, ADD_EVENTS_LOADING, ADD_EVENTS_SUCCESS, GET_DATATASKS_SUCCESS, GET_DATA_ERROR, GET_DATA_LOADING, GET_DATA_SUCCESS, RESET_EVENTS_SUCCESS, SET_GOOGLECALENDAR_LOGIN_FAILURE, SET_GOOGLECALENDAR_LOGIN_SUCCESS, SET_GOOGLECALENDAR_LOGOUT_SUCCESS } from "./actionTypes";

const calenderAuth=JSON.parse(localStorage.getItem('isGoogleCalendarAuth'));
const initState={isLoading:false,isError:false,isGoogleCalendarAuth:calenderAuth||false,data:[],tasks:[],toBeAddedEvents:[]}
export const reducer=(state=initState,{type,payload})=>{
     switch(type){
        case GET_DATA_LOADING:return {...state,isLoading:true};
        case GET_DATA_SUCCESS:return {...state,isLoading:false,data:payload};
        case GET_DATA_ERROR:return {...state,isLoading:false,isError:true};
        case GET_DATATASKS_SUCCESS:return {...state,isLoading:false,tasks:payload};
        case ADD_EVENTS_LOADING:return {...state,isLoading:true};
        case ADD_EVENTS_SUCCESS:return {...state,isLoading:false,toBeAddedEvents:payload};
        case ADD_EVENTS_FAILURE:return {...state,isLoading:false,isError:true};
        case RESET_EVENTS_SUCCESS:return {...state,toBeAddedEvents:[]}
        case SET_GOOGLECALENDAR_LOGIN_SUCCESS:return {...state,isGoogleCalendarAuth:payload};
        case SET_GOOGLECALENDAR_LOGIN_FAILURE:return {...state,isGoogleCalendarAuth:false};
        case SET_GOOGLECALENDAR_LOGOUT_SUCCESS:return {...state,isGoogleCalendarAuth:false};
        default: return state;
     }
}