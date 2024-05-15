import React from 'react';
import '../styles/LoadingLogin.css';
import LoaderGif2 from '../assets/loader_pink.gif'

export const LoadingLogin = ({message}) => (
  <div>
    <div id='loader_gif'><img src={LoaderGif2} alt='loader gif'/></div>
    <p>{message}</p>
  </div >
);