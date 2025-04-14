import React, { useEffect } from 'react'
import UnknowPage from '../../components/Page/UnknowPage';
import { useOutletContext } from 'react-router-dom';

function Setting() {

  const { processHandler, dashboard } = useOutletContext()

  useEffect(() => {
    document.title = 'Chatbot - Cài Đặt';
    dashboard.navigate.active(355)

    return () => ( dashboard.navigate.active('#') )
  })

  return (
    <UnknowPage> </UnknowPage>
  )
}

export default Setting
