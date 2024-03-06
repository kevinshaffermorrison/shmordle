import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { initializeApp } from 'firebase/app'

// Use your config values here.
const app = initializeApp({
  apiKey: 'AIzaSyBoJhXbI2-lzdJNyvqHxHJ7Q2aPAjuBNGY',
  authDomain: 'shmordle.firebaseapp.com',
  projectId: 'shmordle',
  storageBucket: 'shmordle.appspot.com',
  messagingSenderId: '1040439316460',
  appId: '1:1040439316460:web:1acc7acb380f80b143fac9',
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
