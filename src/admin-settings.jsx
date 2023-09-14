import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Component/App';
import { StateProvider } from './Utils/StateProvider';
import reducer, { initialState } from './Utils/reducer';

const root = ReactDOM.createRoot(document.getElementById('boilerplate_root'));

/*
  - Columns is a simple array right now, but it will contain some logic later on. It is recommended by react-table to memoize the columns data
  - Here in this example, we have grouped our columns into two headers. react-table is flexible enough to create grouped table headers
*/

// Render
root.render(
  <StateProvider reducer={reducer} initialState={initialState}>
    <App />
  </StateProvider>
);
