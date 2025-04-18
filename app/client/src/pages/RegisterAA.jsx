import styled from '@emotion/styled';
import { Card, FormControl, FormLabel, TextField, Typography, Box, FormControlLabel, Button, CircularProgress, MenuItem, Select } from '@mui/material';
import Link from '@mui/material/Link';
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '~/apis/Auth';
import { useErrorMessage } from '~/hooks/useMessage';

import ReCAPTCHA from 'react-google-recaptcha';

const RegisterCard = styled(Card)(({ theme }) => ({
  display: 'flex', flexDirection: 'column',
  minWidth: '500px',
  [theme.breakpoints.up('xl')]: {
    minWidth: '550px',
    minHeight: '500px',
  },
  alignSelf: 'center', width: '90vw',
  padding: theme.spacing(4), gap: theme.spacing(2),
  margin: 'auto', background: '#fff', borderRadius: '20px',
  [theme.breakpoints.up('sm')]: { maxWidth: '420px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px' }));

const TextInput = styled(TextField) (({ theme }) => ({
  [theme.breakpoints.up('xl')]: { fontSize: '2.225rem' },
  '& input': { color: '#000' }, WebkitTextFillColor: '#000', 
  '&:hover fieldset': { borderColor: `${theme.palette.primary.main} !important` }
}));

function RegisterAA() {
  const [notificationError, setNotification] = useState(null)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { processHandler, noticeHandler } = useOutletContext();   


  const [captchaToken, setCaptchaToken] = useState(null);

  const recaptchaRef = useRef();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const validateInputs = () => {

    if (!captchaToken && import.meta.env.VITE_ENVIRONMENT == 'production') {
      setNotification('Vui lòng xác minh captcha !')
      return false;
    }

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
 
      setNotification('Vui lòng nhập email hợp lệ !')
      return false;
    }

    if (!password.value || password.value.length < 6) {
      setNotification('Password phải tối thiểu có 6 kí tự !')
      return false;
    }

    setNotification(null)
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (notificationError) return

    const logInEvent = processHandler.add('#register')

    const data = new FormData(event.currentTarget)
    const userData = { email: data.get('email'), password: data.get('password'),  name: data.get('name') };

    await useAuth.register(userData)
      .then((userData) => {
          processHandler.remove('#register', logInEvent)
          noticeHandler.add({
            id: '#542',
            status: 'success',
            message: 'Tạo tài khoản thành công, hãy kiểm tra email để xác thực tài khoản bạn nhé !',
            // auto: false
          })
          setTimeout(() => {
            navigate('/validateEmail')
          }, 500);
        }) 
      .catch((err) => {
        processHandler.remove('#register', logInEvent)
        setNotification(useErrorMessage(err))
      })
  };

  return (
    <>
      <RegisterCard variant="outlined">
        <Typography component="h1" variant="h6"
          sx={{ width: '100%', fontWeight: 600, fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: theme => theme.palette.primary.main }} >
          Tài Khoản Giảng Viên </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, position: 'relative', color: theme => theme.palette.primary.main }} >
          <FormControl sx={{gap: 1}}>
            <FormLabel htmlFor="name" sx = {{ color: 'inherit' }}>Tên tài khoản</FormLabel>
            <TextInput id="name" type="name" name="name" placeholder="Nguyen Van A" inputProps={{ maxLength: 25 }}
               required fullWidth autoFocus variant="outlined" />
          </FormControl>

          <FormControl sx={{gap: 1}}>
            <FormLabel htmlFor="email" sx = {{ color: 'inherit' }}>Tên đăng nhập (Gmail giảng viên trường học)</FormLabel>
            <TextInput id="email" type="username" name="email" placeholder="name@fit.hcmus.edu.edu" inputProps={{ maxLength: 40 }}
              autoComplete="email" required fullWidth variant="outlined" />
          </FormControl>

          <FormControl  sx={{gap: 1}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="password" sx = {{ color: 'inherit' }}>Mật khẩu</FormLabel>
            </Box>
            <TextInput name="password" placeholder="••••••" type="password" id="password" inputProps={{ maxLength: 25 }}
              autoComplete="current-password" required fullWidth variant="outlined"
              sx = {{ color: '#000' }} />
          </FormControl>

          <Box sx = {{ display: {xs: 'block', md: 'flex' }, gap: 2 }}>
            <FormControl  sx={{gap: 1, minWidth: {xs: '100%', md: '65%'}}}>
              <FormLabel htmlFor="department" sx = {{ color: 'inherit', display: 'block', textAlign: 'start' }}>Phạm vi công tác</FormLabel>
              <Select
                id="user_department"
                name= 'department'
                sx = {{ width: '100%',
                  '& .MuiSelect-icon': { color: theme => theme.palette.text.secondary }
                }}
              >
                <MenuItem value={'VPK'}>Văn phòng khoa - CNTT</MenuItem>
                <MenuItem value={'CTSV'}>Phòng công tác sinh viên</MenuItem>
                <MenuItem value={'GV'}>Giảng viên trường FIT-HCMUS</MenuItem>
              </Select>
            </FormControl>

            <FormControl  sx={{gap: 1, minWidth: {xs: '100%', md: '35%'}}}>
              <FormLabel htmlFor="user_position" sx = {{ color: 'inherit', display: 'block' , textAlign: 'start' }}>Chức vụ</FormLabel>
              <Select
                id="user_position"
                name= "user_position"
                sx = {{ width: '100%',
                  '& .MuiSelect-icon': { color: theme => theme.palette.text.secondary },
                }}
              >
                <MenuItem value={'TBM'}>Trưởng bộ môn</MenuItem>
                <MenuItem value={'TP'}>Trưởng phòng</MenuItem>
                <MenuItem value={'CTV'}>Cộng tác viên</MenuItem>
                <MenuItem value={'GVCH'}>Giảng viên cơ hữu</MenuItem>
                <MenuItem value={'NVVP'}>Nhân viên văn phòng</MenuItem>
              </Select>
            </FormControl>
          </Box>

        
          <FormControl  sx={{gap: 1}}>
            <FormLabel htmlFor="user_position" sx = {{ color: 'inherit', display: 'block' , textAlign: 'start' }}>Bộ môn công tác (nếu có)</FormLabel>
              <Select
                id="user_position"
                name= "user_position"
                sx = {{ width: '100%',
                  '& .MuiSelect-icon': { color: theme => theme.palette.text.secondary },
                }}
              >
                <MenuItem key={'CNPM'} value={'CNPM'}>Công Nghệ Phần Mềm</MenuItem>
                <MenuItem key={'HTTT'} value={'HTTT'}>Hệ Thống Thông Tin</MenuItem>
                <MenuItem key={'KHMT'} value={'KHMT'}>Khoa Học Máy Tính</MenuItem>
                <MenuItem key={'TGMT'} value={'TGMT'}>Thị Giác Máy Tính</MenuItem>
                <MenuItem key={'CNTTHUC'} value={'CNTTHUC'}>Công Nghệ Tri Thức</MenuItem>
                <MenuItem key={'CNTT'} value={'CNTT'}>Công Nghệ Thông Tin </MenuItem>
                <MenuItem key={'NONE'} value={'NONE'}>Không có chuyên ngành</MenuItem>
            </Select>
          </FormControl>


          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}
            sx = {{ background: theme => theme.palette.primary.main, '&:hover' : { boxShadow: 'var(--mui-shadows-4)' } }} >
            Tạo tài khoản </Button>

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
            <Typography sx={{ textAlign: 'center' }}>
              <span>
                <Link
                href="/register"
                variant="body2"
                sx={{ alignSelf: 'center' }}
                >
                Bạn là sinh viên FIT-HCMUS?
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
        </Box>

      </RegisterCard>
    </>
  )
}

export default RegisterAA
