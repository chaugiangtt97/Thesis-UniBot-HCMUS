import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useApi } from '~/apis/apiRoute';
import { refresh } from '~/store/actions/authActions';
import { useTranslation } from 'react-i18next';


const UserRoute = ({ children }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth)
  const { processHandler } = useOutletContext();
  const token = localStorage.getItem('token');
  const { t, i18n } = useTranslation();

  if (!token) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    if(token){
      if (!auth.loggedIn) {
        const eventID = processHandler.add('#verifyToken')
        useApi.login_by_token(token).then((usr_profile) => {
            dispatch(refresh(token, usr_profile))
            processHandler.remove('#verifyToken', eventID)

            if(usr_profile?.role && !(['student', 'researcher'].includes(usr_profile?.role))){
              navigate('/')
            }
          }).catch((error) => {
            processHandler.remove('#verifyToken', eventID)
            console.error(t("user_route.auto_login_failed"), error) //"Tự động đăng nhập thất bại!\n"
            navigate('/')
          })
      } else {
        const usr_profile = auth.user
        if(usr_profile?.role && !(['student', 'researcher'].includes(usr_profile?.role))){
          navigate('/')
        }
      }
    }
  }, [])

  return children;
};

export default UserRoute;