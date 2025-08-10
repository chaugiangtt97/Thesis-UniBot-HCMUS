import React from 'react'
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store'
import router from './router'
import "./config/i18n";
// import { useTranslation } from "react-i18next";
function App() {
  // const { t, i18n } = useTranslation();
  // const currentLanguage = i18n.language;
  return (
    <>
      <Provider store={store} stabilityCheck="never">
        <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
