import React from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';

import 'src/index.css';
import App from 'src/App';
import { fetcher } from 'src/api';
import { JobsListContextProvider } from './context/JobsListContext';

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        refreshInterval: 15000,
        fetcher,
      }}
    >
      <JobsListContextProvider>
        <App />
      </JobsListContextProvider>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
);
