import { Box, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useProfile } from '~/apis/Profile'
import { connectSocket } from '~/socket'
import { refresh } from '~/store/actions/authActions'
import NotifycationModal from '~/components/Mui/NotifycationModal'

const demo  = [{
  id: '#542',
  status: 'success',
  message: 'Cập nhật thành công',
  auto: false
},
{
  id: '#541',
  status: 'warning',
  message: 'Cập nhật thành công'
},
{
  id: '#545',
  status: 'error',
  message: 'Cập nhật thành công'
}]

function AppLayout() {
  const generateRandomId = () => { return Math.floor(Math.random() * 1000000000) + 1 };

  const dispatch = useDispatch()

  const token = localStorage.getItem('token');
  const [isProcess, setIsProcess] = useState([])
  const [isFirstRendering, setFirstRendering] = useState(true);
  const auth = useSelector(state => state.auth)
  const reducers_data = useSelector(state => state.reducers)
  const [notifications, setNotification] = useState([])

  const noticeHandler = {
    add: (noti_json) => {
      const id = '#' + generateRandomId()
      const notice = {...noti_json, id }
      setNotification(prev => [notice, ...prev])
    },
    remove: (id) => {
      setNotification(prev => prev.filter((prev) => (prev.id != id) ))
    }
  }

  auth.loggedIn && connectSocket(auth.token)

  const changeFavicon = (iconURL) => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = iconURL;
    document.getElementsByTagName("head")[0].appendChild(link);
  };


  const processHandler = {
    add : (eventCode) => {
      const id = generateRandomId()
      setIsProcess(prev => ([...prev, eventCode + '_' + id]))
      return id
    },
    remove: (eventCode, eventID) => setIsProcess(prev => {
      return prev.filter((event) => event != eventCode + '_' + eventID )
    }),
    list: () => setIsProcess( prev => {
      return prev
    })
  }

  useEffect(() => {
    if(isFirstRendering) {
      changeFavicon('/chatbot.svg')

      if(token) {
        const eventID = processHandler.add('#verifyToken')
        useProfile.verifyToken(token).then((usr_profile) => {
          dispatch(refresh(token, usr_profile))
        }).finally(() => processHandler.remove('#verifyToken', eventID))
        .catch(() => noticeHandler.add({
          status: 'error',
          message: 'Tự động đăng nhập thất bại !'
        }))
      }

      if( !reducers_data?.captcha_token) {
        const eventID = processHandler.add('#verifyToken')
        useAuth.get_captcha_token().then((token) => {
          dispatch(captcha_token(token.key))
        })
        .finally(() => processHandler.remove('#verifyToken', eventID))
      }
    }
    setFirstRendering(false)
  }, [])

  const [isOpenModel, setIsOpenModel] = useState(false)
  const [modalObject, setModalObject] = useState({
    title: '',
    content: '',
    actionName: '',
    action: null
  })

  const getModal = (title = '',content = null, actionName = '', action = null, propsContent = { content : null, props: null } ) => {
    setIsOpenModel(true)
    setModalObject({ title, content, actionName, action, propsContent })
  }

  return <>
  <Box sx = {{ height: '100vh', width: '100vw', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', alignItems: 'center' }}>
    {isProcess.length !== 0 && <Box sx = {{ width: '100%', height: '100%', position: 'absolute', background: theme =>theme.palette.mode == 'dark' ? '#414040bf' : '#000000b5', zIndex: '10000', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgress color="inherit" />
    </Box>}
    <Box className = "Main_container" sx = {{ overflow: 'auto', width: '100vw', maxWidth: '2560px', height: '100%' }}>
      <Outlet context={{ processHandler, noticeHandler, getModal }} />
    </Box>
    <BasicAlerts noticeHandler = {noticeHandler} notifications = {notifications}/>

    <NotifycationModal modalHandler = {{
        state: isOpenModel,
        close: () => setIsOpenModel(false),
        action: modalObject?.action,
        actionName: modalObject?.actionName
      }} title={modalObject?.title} content={modalObject?.content} propsContent = {modalObject?.propsContent}/>
  </Box> 
  </>

}

export default AppLayout

import Alert from '@mui/material/Alert'

const BasicAlerts = ({noticeHandler, notifications}) => {
  return <Box sx = {{ zIndex: 6, position: 'absolute', top: '24px', right: '16px', display: 'flex', gap: 1, flexDirection: 'column' }}>
      {
        notifications.reverse().map((noti, zIndex) => ( 
          <AlertComponent onClose={() => {noticeHandler.remove(noti?.id)}} autoHidden = {noti?.auto}
            key = {noti?.id} id = {noti?.id} zIndex = {zIndex} severity= {noti.status} message={noti.message} duration = {(zIndex + 1) * 1000}/>
        ))
      }
  </Box>
}
import FadeIn from 'react-fade-in';
import { useAuth } from '~/apis/Auth'
import { captcha_token } from '~/store/actions/actions'
const AlertComponent = ({ id , zIndex, onClose, severity, message, duration, autoHidden }) => {
  useEffect(() => {
    if(autoHidden != false){
      const AutoClose = setTimeout(() => onClose(), duration)
      return () => clearTimeout(AutoClose)
    }
  })

  return zIndex < 5 && <FadeIn ><Alert  severity= {severity} variant = "filled" onClose={onClose} >
    {message} - {id}</Alert> </FadeIn>
}