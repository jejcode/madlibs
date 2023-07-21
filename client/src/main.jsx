import React from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import App from './App.jsx';
import './index.css';

ReactDOM.render( // Use ReactDOM.render
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
