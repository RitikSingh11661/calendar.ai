import {ADD_EVENTS_SUCCESS,ADD_TASKS_SUCCESS, GET_DATATASKS_SUCCESS, GET_DATA_ERROR, GET_DATA_LOADING, GET_DATA_SUCCESS, RESET_EVENTS_SUCCESS, SET_GOOGLECALENDAR_LOGIN_FAILURE, SET_GOOGLECALENDAR_LOGIN_REQUEST, SET_GOOGLECALENDAR_LOGIN_SUCCESS, SET_GOOGLECALENDAR_LOGOUT_SUCCESS } from "./actionTypes";

const getDataLoading=()=>({type:GET_DATA_LOADING});
const getDataSuccess=(payload)=>({type:GET_DATA_SUCCESS,payload});
const getDataError=()=>({type:GET_DATA_ERROR});
const getDataTasksSuccess=(payload)=>({type:GET_DATATASKS_SUCCESS,payload});

// const addEventsLoading=()=>({type:ADD_EVENTS_LOADING});
const addEventsSuccess=(payload)=>({type:ADD_EVENTS_SUCCESS,payload});
// const addEventsFailure=()=>({type:ADD_EVENTS_FAILURE});
// const addTasksLoading=()=>({type:ADD_TASKS_LOADING});
const addTasksSuccess=(payload)=>({type:ADD_TASKS_SUCCESS,payload});
// const addTasksFailure=()=>({type:ADD_TASKS_FAILURE});

const resetEventsSuccess=()=>({type:RESET_EVENTS_SUCCESS});

const googleCalendarAuthRequest=()=>({type:SET_GOOGLECALENDAR_LOGIN_REQUEST})
const googleCalendarAuthSuccess=(payload)=>({type:SET_GOOGLECALENDAR_LOGIN_SUCCESS,payload})
export const googleCalendarAuthFailure=()=>({type:SET_GOOGLECALENDAR_LOGIN_FAILURE})
const googleCalendarLogoutSuccess=()=>({type:SET_GOOGLECALENDAR_LOGOUT_SUCCESS})

export const getData=(events)=>(dispatch)=>{
    dispatch(getDataLoading());
    try {
        dispatch(getDataLoading());
        dispatch(getDataSuccess(events))
    } catch (error) {
        dispatch(getDataError())
    }
}

export const getDataTasks=(tasks)=>(dispatch)=>{
    dispatch(getDataTasksSuccess(tasks))
}

export const addEvents=(payload)=>(dispatch)=>{
    dispatch(addEventsSuccess(payload));
}

export const resetEvents=(dispatch)=>{
    dispatch(resetEventsSuccess());
}

export const addTasks=(payload)=>(dispatch)=>{
    dispatch(addTasksSuccess(payload));
}

export const googleCalendarAuth=(payload)=>(dispatch)=>{
    localStorage.setItem('GoogleAuthTime', new Date().getTime()+59*60*1000);
    localStorage.setItem('isGoogleCalendarAuth',JSON.stringify(payload));
    dispatch(googleCalendarAuthRequest());
    dispatch(googleCalendarAuthSuccess(payload));
}

export const googleCalendarLogout=(dispatch)=>{
    localStorage.removeItem('isGoogleCalendarAuth');
    localStorage.removeItem('GoogleAuthTime');
    dispatch(googleCalendarLogoutSuccess())
}

