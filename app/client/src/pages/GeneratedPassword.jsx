import styled from '@emotion/styled';
import { Card, FormControl, FormLabel, TextField, Typography, Box, FormControlLabel, Button, CircularProgress, Tooltip } from '@mui/material';
import Link from '@mui/material/Link';
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useProfile } from '~/apis/Profile';
function GeneratedPassword() {
  const [notificationError, setNotification] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(null)
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const { processHandler, noticeHandler  } = useOutletContext();   

  const validateInputs = () => {
    if (!captchaToken && import.meta.env.VITE_ENVIRONMENT == 'production') {
      setNotification('Vui lòng xác minh captcha !')
      setNotificationSuccess(null)
      return false;
    }

    const new_password = document.getElementById('new-password');
    const new_password_2 = document.getElementById('new-password-2');
    console.log(new_password.value, new_password_2.value)
    if (!new_password.value || new_password.value.length < 6) {
      setNotificationSuccess(null)
      setNotification('Password phải tối thiểu có 6 kí tự !')
      return false;
    }

    if (!(new_password.value == new_password_2.value)) {
      setNotificationSuccess(null)
      setNotification('Password lặp lại không trùng khớp !')
      return false;
    }

    setNotification(null)
    return true;
  };
  const { _id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (notificationError) return

    const data = new FormData(event.currentTarget)
    const userData = { 
      _id: _id, 
      newPassword: data.get('new-password'), 
      verification: data.get('verify-password'),
      captchaToken: captchaToken
    };

    const updatePasswordEvent = processHandler.add('#updatePassword')
    await useProfile.updatePassword(userData)
      .then(() => {
          processHandler.remove('#updatePassword', updatePasswordEvent)
          noticeHandler.add({
            status: 'success',
            message: 'Cập nhật mật khẩu thành công !',
          })
          setTimeout(() => navigate('/signin'), 1000)
        }) 
      .catch((err) => {
        processHandler.remove('#updatePassword', updatePasswordEvent)
        noticeHandler.add({
          status: 'error',
          message: err,
        })
        console.log(err)
        setNotification(useErrorMessage(err))
      })
  };

  return (
    <>
      <SignInCard variant="outlined">
        <Typography component="h1" variant="h6"
          sx={{ width: '100%', fontWeight: 600, fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: theme => theme.palette.primary.main }} >
          Thay đổi mật khẩu </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, position: 'relative', color: theme => theme.palette.primary.main }} >

          <FormControl sx={{gap: 1}}>
            <FormLabel htmlFor="new-password" sx = {{ color: 'inherit' }}>Tạo mật khẩu mới</FormLabel>
            <TextInput name="new-password" placeholder="••••••" type="password" id="new-password"
              autoComplete="new-password" required fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
              sx = {{ color: '#000' }} />
          </FormControl>

          <FormControl sx={{gap: 1}}>
            <FormLabel htmlFor="new-password-2" sx = {{ color: 'inherit' }}>Tạo mật khẩu mới (Nhập lại)</FormLabel>
            <TextInput name="new-password-2" placeholder="••••••" type="password" id="new-password-2"
              autoComplete="new-password-2" required fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
              sx = {{ color: '#000' }} />
          </FormControl>

          <FormControl sx={{gap: 1}}>
            <FormLabel htmlFor="verify-password" sx = {{ color: 'inherit' }}>Mã xác thực <Tooltip placement="top" title="Kiểm tra email để nhận mã xác nhận"><InfoOutlinedIcon/> </Tooltip></FormLabel>
            <TextInput name="verify-password" placeholder="••••••" id="verify-password"
              autoComplete="verify-password" required fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
              sx = {{ color: '#000' }} />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}
            sx = {{ background: theme => theme.palette.primary.main, '&:hover' : { boxShadow: 'var(--mui-shadows-4)' } }} >
            Xác Nhận </Button>

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

export default GeneratedPassword
