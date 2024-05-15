import React, { forwardRef } from 'react'
import tutorial from '../assets/tutorial.gif'
import '../styles/About.css'

export const About = forwardRef((props, ref) => {
  return (
    <section ref={ref} id="about">
      <div className="about__content">
        <div className="about__image-container">
          <img className="about__image" src={tutorial} alt="tutorial" />
        </div>
        <h2 className="about__title">About</h2>
        <div className="about__text-container">
          <p className="about__text">
            Welcome to <span className="about__highlight">Calendar Ai</span> 📅, the revolutionary platform that allows you to schedule your events with ease! With our innovative approach, you can now say goodbye to the tedious process of manually inputting your schedule into a calendar.
          </p>
          <p className="about__text">
            Our platform offers a unique solution that allows you to simply upload an image or PDF of your timetable or schedule, and I'll take care of the rest. My integration with the Google Calendar API ensures that your events are automatically added to your calendar, making it easier for you to stay on top of your schedule.
          </p>
          <p className="about__text">
            I also understand the importance of data privacy and security, which is why I've chosen to utilize AWS services. Rest assured that your data is always safe and secure with me.
          </p>
          <p className="about__text">
            In addition to the timetable scheduling feature, we've also recently introduced an advanced event management system. You can now create events directly within the platform. This new feature provides more flexibility and control over your schedule.
          </p>
          <p className="about__text">
            I've designed my platform to be user-friendly and intuitive, so even if you have no tech background, you'll find it easy to navigate and use. With Calendar Ai, scheduling has never been this simple.
          </p>
          <p className="about__text">
            Thank you for choosing us, and I hope you enjoy using my platform as much as I enjoyed creating it.
          </p>
        </div>
      </div>
    </section>
  )
});