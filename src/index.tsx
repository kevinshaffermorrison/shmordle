import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { initializeApp } from 'firebase/app'

// Use your config values here.
const app = initializeApp({
  apiKey: 'AIzaSyBWGR-qbj6aDYJk1O-1ynve0cbxOAg6D_M',
  authDomain: 'wordle-6bcb8.firebaseapp.com',
  projectId: 'wordle-6bcb8',
  storageBucket: 'wordle-6bcb8.appspot.com',
  messagingSenderId: '1039377188343',
  appId: '1:1039377188343:web:27f59c95c767a1bba9daf2',
  measurementId: 'G-SL9FFYWRKF',
})

ReactDOM.render(
  <React.StrictMode>
    <App firebase={app} />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
