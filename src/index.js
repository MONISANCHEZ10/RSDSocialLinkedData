import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
//const auth = require('solid-auth-client')
//window.solid = { auth }
//console.log(' src/index.js')

import App from './components/App';

const title = 'My Minimal React Webpack Babel Setup*************';

ReactDOM.render(

  <App title={title} />,
  document.getElementById('app')
);

module.hot.accept();
