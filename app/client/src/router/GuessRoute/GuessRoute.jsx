import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useApi } from '~/apis/apiRoute';
import { logout, refresh } from '~/store/actions/authActions';

const GuessRoute = ({ children }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth)
  const { processHandler } = useOutletContext();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if(token){
      if (!auth.loggedIn) {
        const eventID = processHandler.add('#verifyToken')
        useApi.login_by_token(token).then((usr_profile) => {
            dispatch(refresh(token, usr_profile))
            processHandler.remove('#verifyToken', eventID)

            if(usr_profile?.role && ['administrator', 'academic_administration', 'lecturer'].includes(usr_profile?.role)){
              navigate('/dashboard')
            } else if (usr_profile?.role && ['student', 'researcher'].includes(usr_profile?.role)){
              navigate('/')
            }
          }).catch((error) => {
            processHandler.remove('#verifyToken', eventID)
            dispatch(logout())
          })
      } else {
        const usr_profile = auth.user
        if(usr_profile?.role && ['administrator', 'academic_administration', 'lecturer'].includes(usr_profile?.role)){
          navigate('/dashboard')
        } else if (usr_profile?.role && ['student', 'researcher'].includes(usr_profile?.role)){
          navigate('/')
        }

      }
    }
  }, [token, auth])

  if (!token) {
    return children;
  }

  return children;
};

export default GuessRoute;