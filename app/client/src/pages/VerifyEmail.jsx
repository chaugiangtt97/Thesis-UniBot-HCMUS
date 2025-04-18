import styled from '@emotion/styled';
import { Card, FormControl, FormLabel, TextField, Typography, Box, FormControlLabel, Button, CircularProgress } from '@mui/material';
import Link from '@mui/material/Link';
import React, { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '~/apis/Auth';
import { useErrorMessage } from '~/hooks/useMessage';

const SignInCard = styled(Card)(({ theme }) => ({
  minWidth: '500px',
  [theme.breakpoints.up('xl')]: {
    minWidth: '550px',
    minHeight: '500px',
  },
  display: 'flex', flexDirection: 'column',
  alignSelf: 'center', width: '90vw',
  padding: theme.spacing(4), gap: theme.spacing(2),
  margin: 'auto', background: '#fff', borderRadius: '20px',
  [theme.breakpoints.up('sm')]: { maxWidth: '420px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px' }));

const TextInput = styled(TextField) (({ theme }) => ({
  '& input': { color: '#000' }, WebkitTextFillColor: '#000', 
  '&:hover fieldset': { borderColor: `${theme.palette.primary.main} !important` }
}));

function VerifyEmail() {
  const [notificationError, setNotification] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(null)

  const navigate = useNavigate();
  const { processHandler } = useOutletContext();   

  const validateInputs = () => {

    if (!code) {
      setNotificationSuccess(null)
      setNotification('Mã Không Được Bỏ Trống !')
      return false;
    }

    setNotification(null)
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    const logInEvent = processHandler.add('#login')

    await useAuth.validateEmail(code)
      .then(() => {
          processHandler.remove('#login', logInEvent)
          navigate('/signin')
        })
      .catch((err) => {
        processHandler.remove('#login', logInEvent)
        console.log(err)
        setNotification(useErrorMessage(err))
      })
  };

  const [code, setCode] = useState(null)

  return (
    <>
      <SignInCard variant="outlined">
        <Typography component="h1" variant="h6"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: theme => theme.palette.primary.main }} >
          Tài Khoản </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, position: 'relative', color: theme => theme.palette.primary.main }} >
         
          <FormControl sx={{gap: 1}}>
            <FormLabel htmlFor="_id" sx = {{ color: 'inherit' }}>Mã Xác Thực</FormLabel>
            <TextInput onChange={(e) => setCode(e.target.value)} id="_id" type="_id" name="_id" placeholder="xxx-xxx-xxxxx" value={code || ''}
              inputProps={{ maxLength: 40 }}
              autoComplete="_id" autoFocus required fullWidth variant="outlined" />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}
            sx = {{ background: theme => theme.palette.primary.main, '&:hover' : { boxShadow: 'var(--mui-shadows-4)' } }} >
            Xác Nhận </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography sx={{ textAlign: 'center' }}>
              <span>
                <Link
                href="/signin"
                variant="body2"
                sx={{ alignSelf: 'center' }}
                >
                Trở về trang đăng nhập
                </Link>
              </span>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', width: '100%' }}>
            <Typography sx={{ textAlign: 'start', color: '#0bac07' }}>
              Lưu ý: Mỗi code chỉ ứng với một tài khoản định danh. Chỉ khi xác thực, tài khoản của bạn mới được kích hoạt
            </Typography>
            <Typography sx={{ textAlign: 'start', color: '#0bac07' }}>
              Hãy kiểm tra email của bạn !
            </Typography>
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

export default VerifyEmail
