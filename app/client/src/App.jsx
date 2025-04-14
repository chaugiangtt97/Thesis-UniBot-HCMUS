import React from 'react'
import { Provider, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store'
import router from './router'

function App() {
  return (
    <Provider store={store} stabilityCheck="never">
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
