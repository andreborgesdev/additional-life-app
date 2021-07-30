import React from 'react';
import { render } from 'react-dom';
import './index.css';
import Router from "./components/Router";
import reportWebVitals from './reportWebVitals';

render(<Router />, document.querySelector('#root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();