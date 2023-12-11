import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Signup } from '../pages/Signup'
import { Login } from '../pages/Login'
import { MainPage } from '../pages/MainPage'
import { NotFound } from '../pages/NoteFound'
import { PrivacyPolicy } from '../pages/PrivacyPolicy'

export const AllRoutes =()=> {
  return (
    <Routes>
        <Route exect path='/' element={<MainPage/>}/>
        <Route path='/about' element={<MainPage/>}/>
         {/* exact doubt:- Is it true by default in every route?
        <Route path='/about/app' element={<h1>About page 2</h1>}/> */}
        <Route path='/instructions' element={<MainPage/>}/>
        <Route path='/contact' element={<MainPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/privacypolicy' element={<PrivacyPolicy/>}/>
        <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}
