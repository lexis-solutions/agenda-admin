import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SWRConfig } from 'swr';

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        refreshInterval: 15,
        fetcher: (url) => fetch(url).then((res) => res.json()),
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
);
