import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useProfile } from '~/apis/Profile';
import { refresh } from '~/store/actions/authActions';

const AdminRoute = ({ children }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth)
  const { processHandler } = useOutletContext();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if(token){
      if (!auth.loggedIn) {
        const eventID = processHandler.add('#verifyToken')
        useProfile.verifyToken(token).then((usr_profile) => {
          dispatch(refresh(token, usr_profile))
          processHandler.remove('#verifyToken', eventID)
          if(usr_profile?.role && !(['administrator', 'academic_administration', 'lecturer'].includes(usr_profile?.role))){
            navigate('/')
          }
        }).catch((error) => {     
          processHandler.remove('#verifyToken', eventID)
          console.error("Tự động đăng nhập thất bại!\n", error)
          navigate('/')
        })
      } else {
        const usr_profile = auth.user
        if(usr_profile?.role && !(['administrator', 'academic_administration', 'lecturer'].includes(usr_profile?.role))){
          navigate('/')
        }
      }
    }
  }, [])

  if (!token) {
    return <Navigate to="/" />;
  }

  return children
};

export default AdminRoute;