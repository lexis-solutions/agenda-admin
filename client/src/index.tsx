import React from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';

import 'src/index.css';
import App from 'src/App';
import { fetcher } from 'src/api';
import { JobsListContextProvider } from './context/JobsListContext';
import { DEFAULT_REFRESH_INTERVAL } from './constants';

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        refreshInterval: DEFAULT_REFRESH_INTERVAL,
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
