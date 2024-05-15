import React, {forwardRef} from 'react'
import { useSelector } from 'react-redux';
import { GoogleCalendarEvents } from './GoogleCalendarEvents';
// import { GoogleCalendarTasks } from './GoogleCalendarTasks';
import { DetectText } from './DetectText';
import { GoogleAuthButton } from './GoogleAuthButton';

export const Home = forwardRef((props, ref) => {
  const isGoogleCalendarAuth = useSelector(store => store.AppReducer.isGoogleCalendarAuth);
  const isAuth = useSelector(store => store.AuthReducer.isAuth);

  return (
    <div ref={ref} id='home' style={{paddingTop:'10vh'}} >
      <GoogleAuthButton />
      {(isGoogleCalendarAuth && isAuth) &&  <div>
        <DetectText/>
        <GoogleCalendarEvents/>
        {/* <GoogleCalendarTasks /> */}
      </div>}
    </div>
  )
})