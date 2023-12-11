import React, { forwardRef } from 'react'
import '../styles/Instructions.css'

export const Instructions = forwardRef((props, ref) => {
  return (
    <section ref={ref} id="instructions">
      <div className="instructions__content">
        <h2 className="instructions__title">Instructions</h2>
        <ol className="instructions__list">
          <li className="instructions__item">
            To get started, you need to authenticate yourself using Authorization in order to access your Google Calendar.
          </li>
          <li className="instructions__item">
            We accept two file formats: image and PDF. Make sure your timetable or schedule is in one of these formats before uploading.
          </li>
          <li className="instructions__item">
            When uploading your schedule, ensure that your header contains the following: Title, Timings and date in the format of dd/mm/yyyy.
          </li>
          <div className="instructions__image">
            <a href="https://s3.ap-south-1.amazonaws.com/calendar.ai/testing.png" target="_blank" rel="noopener noreferrer">
              <img src="https://s3.ap-south-1.amazonaws.com/calendar.ai/testing.png" alt="Example timetable" />
            </a>
          </div>
          <li className="instructions__item">
            Any other information in your schedule that is not related to Title, Timings and date will be considered unwanted and will not be added to your calendar.
          </li>
        </ol>
      </div>
    </section>
  )
})