import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SWRConfig } from 'swr';

const refreshInterval = process.env.REACT_APP_REFRESH_INTERVAL
  ? parseInt(process.env.REACT_APP_REFRESH_INTERVAL)
  : 15000;

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        refreshInterval,
        fetcher: (url) => fetch(url).then((res) => res.json()),
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
);
