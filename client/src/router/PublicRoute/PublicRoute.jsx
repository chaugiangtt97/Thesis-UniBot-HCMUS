import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { useProfile } from '~/apis/Profile';
import { refresh } from '~/store/actions/authActions';

const PublicRoute = ({ children }) => {

  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const { processHandler } = useOutletContext();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if(token){
      if (!auth.loggedIn) {
        const eventID = processHandler.add('#verifyToken')
        useProfile.verifyToken(token).then((usr_profile) => {
          dispatch(refresh(token, usr_profile))
        }).catch((error) => {
          console.error(error)
        }).finally(() => processHandler.remove('#verifyToken', eventID))
      }
    }
  }, [token])

  return children;
};

export default PublicRoute;