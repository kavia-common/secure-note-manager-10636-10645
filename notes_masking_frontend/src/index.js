import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// For demo: Import SearchEmpty demo screen.
// import DemoSearchEmptyScreen from "./SearchEmpty.demo";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* For demo: Swap the following for <App /> to preview just the SearchEmpty UI */}
    {/* <DemoSearchEmptyScreen /> */}
  </React.StrictMode>
);
