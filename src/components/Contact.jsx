import React, { forwardRef } from 'react'
import '../styles/Contact.css'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { EmailOutlined, GitHub, LinkedIn} from '@mui/icons-material';

export const Contact = forwardRef((props, ref) => {
    return (
        <div ref={ref} id='contact'>
            <div>
                <h1>Contact</h1>
                <p id='intro-line'>Whether you have a project in mind or just want to say hello, I'd love to hear from you!</p>
                <div id='contact-details'>
                    <p id='contact-email'>Email : ritikofficial11661@gmail.com</p>
                    <p id='contact-phone'>Mobile : +91-7217 729 644</p>
                    <p id='contact-location'>Location : New Delhi, India</p>
                </div>
                <div id='contact-icons'>
                    <a href="tel:7217 729 644" aria-label="Phone" rel="noreferrer" target="_blank"><LocalPhoneIcon /></a>
                    <a href="mailto: ritikofficial11661@gmail.com" aria-label="Email" target="_blank" rel="noreferrer"><EmailOutlined /></a>
                    <a id='contact-github' href="https://github.com/RitikSingh11661" aria-label="GitHub" rel="noreferrer" target="_blank"><GitHub /></a>
                    <a id='contact-linkedin' href="https://www.linkedin.com/in/ritik-singh-a4547823b/" aria-label="LinkedIn" target="_blank" rel="noreferrer"><LinkedIn /></a>
                </div>
            </div>
            <div id='bottom'><p>Designed and built by Ritik, 2023. All rights reserved.</p></div>
        </div>
    )
});
