import React from 'react'
import { FaPlus } from "react-icons/fa";
import '../styles/AddGoogleThing.css'

export const AddGoogleCalenderThing = ({ title, onClick }) => {
  return (
    <div id='add-button-container'>
      <button className="add-button" onClick={onClick}>
        <FaPlus className="add-icon" />
        <span className="add-label">{title}</span>
      </button>
    </div>
  )
}
