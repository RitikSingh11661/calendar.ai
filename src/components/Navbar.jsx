import React, { useState } from 'react';
import { MenuBookOutlined, MenuOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../redux/Auth/actions';
// import logo from '../assets/calendarai_logo.png'

export const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(false)
  const isAuth = useSelector(store => store.AuthReducer.isAuth);
  const dispatch = useDispatch();

  const handleScroll = (ref) => {
    const id = ref.current.id;
    setCurrentLink(id)
    ref.current.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  }

  const toggleMenu = () => { setIsOpen(!isOpen) };

  const handleSignout = () => {
    dispatch(setLogout)
  }

  return (
    <div className='navbar' id='nav-menu'>
      <div className='nav-logo'><h2>CalendarAi by Ritik</h2></div>
      <div className='menu-button' onClick={toggleMenu}><MenuOutlined className='menu' /></div>
      <nav className={!isOpen ? 'nav-close' : 'nav-open'}>
        <Link to='/about' className={currentLink==='about'?'nav-link_about_current':'nav-link_about'} onClick={() => handleScroll(props.aboutRef)}>About</Link>
        <Link to='/instructions' className= {currentLink==='instructions'?'nav-link_instructions_current':'nav-link_instructions'} onClick={() => handleScroll(props.instructionsRef)}>Instructions</Link>
        <Link to='/' className={currentLink==='home'?'nav-link_home_current':'nav-link_home'} onClick={() => handleScroll(props.homeRef)}>Home</Link>
        <Link to='/contact' className={currentLink==='contact'?'nav-link_contact_current':'nav-link_contact'} onClick={() => handleScroll(props.contactRef)}>Contact</Link>
        {!isAuth && <Link to='/login' className='nav-link_login'>Login</Link>}
        {isAuth && <Link className='nav-link_signout' onClick={handleSignout}>Signout</Link>}
        <Link to='/privacypolicy'>Privacy Policy</Link>
      </nav>
      <div className='changer'><MenuBookOutlined className='menu' /></div>
    </div>
  )
}