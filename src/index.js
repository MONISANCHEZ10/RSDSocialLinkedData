import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css'

//const auth = require('solid-auth-client')
//window.solid = { auth }
//console.log(' src/index.js')
import './assets/css/animate.css';
import  './assets/css/bootstrap.min.css';
import  './assets/css/styleT.css';
import  './assets/css/jquery.mCustomScrollbar.min.css';
import  './assets/css/responsiveT.css';


import App from './components/App';

const title = 'My Minimal React Webpack Babel Setup*************';

ReactDOM.render(

  <App title={title} />,
  document.getElementById('app')
);

module.hot.accept();
