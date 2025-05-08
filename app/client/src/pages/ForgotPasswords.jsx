import styled from '@emotion/styled';
import { Card, FormControl, FormLabel, TextField, Typography, Box, FormControlLabel, Button, CircularProgress } from '@mui/material';
import Link from '@mui/material/Link';
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { login } from '~/store/actions/authActions';
import { useAuth } from '~/apis/Auth';
import { useErrorMessage } from '~/hooks/useMessage';

import ReCAPTCHA from 'react-google-recaptcha';

const SignInCard = styled(Card)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', 
  minWidth: '500px',
  [theme.breakpoints.up('xl')]: {
    minWidth: '550px',
    minHeight: '500px',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(6),
  },
  alignSelf: 'center', width: '90vw',
  padding: theme.spacing(4), gap: theme.spacing(2),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(1),
  margin: 'auto', background: '#fff', borderRadius: '20px',
  [theme.breakpoints.up('sm')]: { maxWidth: '420px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px' }));

const TextInput = styled(TextField) (({ theme }) => ({
  '& input': { color: '#000' }, WebkitTextFillColor: '#000', 
  '&:hover fieldset': { borderColor: `${theme.palette.primary.main} !important` }
}));

function ForgotPasswords() {
  const [notificationError, setNotification] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(null)
  const [captchaToken, setCaptchaToken] = useState(null);

  const recaptchaRef = useRef();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { processHandler } = useOutletContext();   

  const validateInputs = () => {
    if (!captchaToken && import.meta.env.VITE_ENVIRONMENT == 'production') {
      setNotification('Vui lòng xác minh captcha !')
      setNotificationSuccess(null)
      return false;
    }

    const email = document.getElementById('email');

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
 
      setNotification('Vui lòng nhập email hợp lệ !')
      setNotificationSuccess(null)
      return false;
    }

    setNotification(null)
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (notificationError) return

    const email = document.getElementById('email');

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
 
      setNotification('Vui lòng nhập email hợp lệ !')
      setNotificationSuccess(null)
      return false;
    }
    const verifyEmailEvent = processHandler.add('#verifyEmail')

    await useAuth.send_verifyEmail(email.value, 'FORGOT_PASSWORD', captchaToken)
      .then((data) => {
          processHandler.remove('#verifyEmail', verifyEmailEvent)
          setNotificationSuccess('Gởi Yêu Câu Trong Giây Lát, Kiểm Tra Email Của Bạn !')
          setNotification()
          navigate(`/forgotPassword/${data.temp_id}`)
        }) 
      .catch((err) => {
        processHandler.remove('#verifyEmail', verifyEmailEvent)
        setNotification(useErrorMessage(err))
        setNotificationSuccess(null)
      })

  };


  return (
    <>
      <SignInCard variant="outlined">
        <Typography component="h1" variant="h6"
          sx={{ width: '100%', fontWeight: 600, fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: theme => theme.palette.primary.main }} >
          Quên Mật Khẩu </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, position: 'relative', color: theme => theme.palette.primary.main }} >
          <FormControl sx={{gap: 1}}>
            <FormLabel htmlFor="email" sx = {{ color: 'inherit' }}>Email đăng nhập</FormLabel>
            <TextInput id="email" type="username" name="email" placeholder="mssv@email.com" inputProps={{ maxLength: 40 }}
              autoComplete="email" autoFocus required fullWidth variant="outlined" />
          </FormControl>
          
          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}
            sx = {{ background: theme => theme.palette.primary.main, '&:hover' : { boxShadow: 'var(--mui-shadows-4)' } }} >
            Tiếp Tục </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ textAlign: 'center' }}>
              <span>
                <Link
                href="/signin"
                variant="body2"
                sx={{ alignSelf: 'center' }}
                >
                Trở về đăng nhập
                </Link>
              </span>
            </Typography>
          </Box>

          <Box sx = {{ display: 'flex', justifyContent: 'end'}}>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RESCAPTCHA_SITE_KEY}
              data-theme="dark"
              render="explicit"
              onChange={handleCaptchaChange}
              ref={recaptchaRef}
            />
          </Box>

          <Typography sx = {{ width: '100%' , textAlign: 'end', color: 'red' }}>
            {notificationError}
          </Typography>
          <Typography sx = {{ width: '100%' , textAlign: 'end', color: 'green' }}>
            {notificationSuccess}
          </Typography>
          
        </Box>

      </SignInCard>
    </>
  )
}

export default ForgotPasswords
