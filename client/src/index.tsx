import React from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';

import 'src/index.css';
import App from 'src/App';
import { REFRESH_INTERVAL } from 'src/constants';

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        refreshInterval: REFRESH_INTERVAL,
        fetcher: (url) => fetch(url).then((res) => res.json()),
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
);
