import React, { useEffect } from 'react'
import '../styles/GoogleAuthButtonStyle.css'
import { useDispatch, useSelector } from 'react-redux';
import { getData, getDataTasks, googleCalendarAuth, googleCalendarAuthFailure, googleCalendarLogout } from '../redux/App/action';
import { useNavigate } from 'react-router-dom';
import googleCalendar from '../assets/google-calendar.png'

export const GoogleAuthButton = () => {
  const { isGoogleCalendarAuth } = useSelector(store => store.AppReducer);
  const isAuth = useSelector(store => store.AuthReducer.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let google = window.google, gapi = window.gapi, tokenClient;;
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const SCOPES_CALENDAR = "https://www.googleapis.com/auth/calendar";
  // const SCOPES_TASKS = "https://www.googleapis.com/auth/tasks";
  // const COMBINED_SCOPES = `${SCOPES_CALENDAR} ${SCOPES_TASKS}`;
  const COMBINED_SCOPES = `${SCOPES_CALENDAR}`;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const DISCOVERY_DOC_CALENDAR = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  // const DISCOVERY_DOC_TASKS = 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest';

  const listUpcomingEvents = async () => {
    let response;
    try {
      const request = {
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 20,
        'orderBy': 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
      const events = response?.result?.items;
      dispatch(getData(events))
    } catch (err) { console.log(err) }
  }

  // const listTasks = async () => {
  //   // gapi.client.tasks.tasklists.list({ 'maxResults': 10 }).then(res=>console.log(res.results.items))

  //   // Single Task contains below key values pairs
  //   // due:"2023-03-18T00:00:00.000Z",id,links:[],notes:"Testing 1 tasks list",status:"needsAction",title
  //   // gapi.client.tasks.tasks.list({tasklist:'MTc0MTY5NjA3MTc2ODY1MDAwNjk6MDow', maxResults: 10 }).then(res=>console.log('res',res))

  //   // ever task list contain id,title,updated
  //   try {
  //     const response = await gapi.client.tasks.tasks.list({ tasklist: 'MTc0MTY5NjA3MTc2ODY1MDAwNjk6MDow', maxResults: 10 });
  //     const taskData = response?.result?.items;
  //     dispatch(getDataTasks(taskData));
  //   } catch (error) { console.error(error); }
  // }

  const initializeGapiClient = async () => {
    try {
      await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC_CALENDAR] });
      if (isGoogleCalendarAuth) {
        const { access_token, expires_in } = isGoogleCalendarAuth;
        gapi.client.setToken({ access_token, expires_in });
        listUpcomingEvents();
        // listTasks();
      }
    } catch (error) { console.log('error', error) }
  }

  const gapiLoaded = () => { gapi.load('client', initializeGapiClient) }

  const gisLoaded = () => {
    try {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        // scope: SCOPES_TASKS,
        scope: COMBINED_SCOPES,
        callback: '', // defined later
      });
    } catch (error) { console.log('error', error) }
  }

  const handleAuthClick = () => {
    if (!isAuth) {
      alert('You are not authenticated, Login or Signup is required');
      navigate('/login');
      return;
    } else {
      if (!tokenClient) gisLoaded();
      tokenClient.callback = async (resp) => {
        if (resp.error) throw (resp);
        try {
          await listUpcomingEvents();
          const { access_token, expires_in, refresh_token } = gapi.client.getToken();
          let obj = { access_token, expires_in, refresh_token };
          dispatch(googleCalendarAuth(obj))
        } catch (error) {
          console.log('error', error);
          dispatch(googleCalendarAuthFailure(error))
        }
      };
    }

    if (!isGoogleCalendarAuth) {
      // Prompt the user to select a Google Account and ask for consent to share their toBeAddedEvents
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  const handleSignoutClick = async () => {
    const token = await gapi?.client?.getToken();
    if (token && isGoogleCalendarAuth) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      dispatch(googleCalendarLogout)
    }
  }

  useEffect(() => {
    gapiLoaded()
    gisLoaded()
    const expirationTime = new Date(parseInt(localStorage.getItem('GoogleAuthTime'))).getTime();
    const currentTime = new Date().getTime(), timeRemaining = expirationTime - currentTime;
    // console.log(convertTimestamp(expirationTime));
    const timeoutId = setTimeout(() => {
      handleSignoutClick();
    }, timeRemaining);
    return () => clearTimeout(timeoutId);
  }, [isGoogleCalendarAuth]);

  return (
    <div className="google-auth-container">
      <div>
        {isGoogleCalendarAuth && isAuth ? (
          <div className="google-auth-text">
            <p>You're authenticated with Google Calendar.</p>
            <p>You can now schedule events in your Google Calendar.</p>
            <button className="signout-button" onClick={handleSignoutClick}>Sign Out</button>
          </div>
        ) : (
          <>
            <p>Authorize with Google Calendar to schedule events in your calendar.</p>
            <button className="auth-button" onClick={handleAuthClick}>
              <div className='auth_container'>
              <img src={googleCalendar} alt="calendar_icon"/>
            <p>Authorize</p>
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
