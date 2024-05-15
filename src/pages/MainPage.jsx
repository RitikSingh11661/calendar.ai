import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { About } from '../components/About'
import { Instructions } from '../components/Instructions'
import { Home } from '../components/Home'
import { useDispatch, useSelector } from 'react-redux'
import { setLogout } from '../redux/Auth/actions'
import { Contact } from '../components/Contact'

export const MainPage = () => {
    const {isAuth} = useSelector(store=>store.AuthReducer);
    const dispatch = useDispatch();
    const aboutRef = useRef(null);
    const instructionsRef = useRef(null);
    const homeRef = useRef(null);
    const contactRef = useRef(null);

    const handleSignoutClick=()=>{
        if(isAuth)dispatch(setLogout)
      }

    useEffect(()=>{
        const expirationTime = new Date(parseInt(localStorage.getItem('isAuth'))).getTime();
        const currentTime = new Date().getTime(), timeRemaining = expirationTime - currentTime;
        // console.log(convertTimestamp(expirationTime));
        const timeoutId = setTimeout(() => { 
          handleSignoutClick();
        }, timeRemaining);
        return () => clearTimeout(timeoutId);
    },[])

    // const convertTimestamp = (timestamp) => {
    //     const date = new Date(timestamp); //1681641044403
    //     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    //     const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    //     return formattedDate; //Sun Apr 16 2023 16:00:44 GMT+0530 (IST);
    // }

    return (
        <div style={{backgroundCorlor:'#f4f4f4' }}>
            <Navbar homeRef={homeRef} aboutRef={aboutRef} instructionsRef={instructionsRef} contactRef={contactRef} />
            <About ref={aboutRef} />
            <Instructions ref={instructionsRef} />
            <Home ref={homeRef} />
            <Contact ref={contactRef} />
        </div>
    )
}
