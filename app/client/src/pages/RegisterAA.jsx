import styled from '@emotion/styled';
import { Card, FormControl, FormLabel, TextField, Typography, Box, FormControlLabel, Button, CircularProgress, MenuItem, Select } from '@mui/material';
import Link from '@mui/material/Link';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useErrorMessage } from '~/hooks/useMessage';

import ReCAPTCHA from 'react-google-recaptcha';
import { useApi } from '~/apis/apiRoute';
import { useTranslation } from 'react-i18next';

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
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px'
}));

const TextInput = styled(TextField)(({ theme }) => ({
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
      setNotification(t("lecturer_register_page.notice.captcha_required"))
      return false;
    }

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setNotification(t("lecturer_register_page.notice.email_invalid"))
      return false;
    }

    if (!password.value || password.value.length < 6) {
      setNotification(t("lecturer_register_page.notice.password_min_length"))
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

    await useApi.register(
      data.get('email'),
      data.get('password'),
      data.get('name'),
      'lecturer', {
      administrativeUnit: data.get('administrativeUnit'),
      lecturerPosition: data.get('lecturerPosition'),
      teachingDepartment: data.get('teachingDepartment')
    },
      captchaToken
    )
      .then(() => {
        processHandler.remove('#register', logInEvent)
        noticeHandler.add({
          id: '#542',
          status: 'success',
          message: t('lecturer_register_page.notice.register_success')   // 'Dang ky thanh cong, vui long kiem tra email de xac thuc tai khoan !',
        })

        navigate('/email/verify-email', { state: { email: document.getElementById('email').value } })
        // import.meta.env.VITE_ENVIRONMENT == 'production' ? 
        //   navigate('/email/verify-email', { state: { email: data.get('email') } }) : navigate('/signin')
      })
      .catch((err) => {
        processHandler.remove('#register', logInEvent)
        setNotification(useErrorMessage(err))
      })
  };
  const reducers_data = useSelector(state => state.reducers)
  const { t, i18n } = useTranslation();

  return (
    <>
      <RegisterCard variant="outlined">
        <Typography component="h1" variant="h6"
          sx={{ width: '100%', fontWeight: 600, fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: theme => theme.palette.primary.main }} >
          {t("lecturer_register_page.heading")} </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, position: 'relative', color: theme => theme.palette.primary.main }} >
          <FormControl sx={{ gap: 1 }}>
            <FormLabel htmlFor="name" sx={{ color: 'inherit' }}>{t("lecturer_register_page.name_label")} </FormLabel>
            <TextInput id="name" type="name" name="name" placeholder={t("lecturer_register_page.name_placeholder")} inputProps={{ maxLength: 25 }}
              required fullWidth autoFocus variant="outlined" />
          </FormControl>

          <FormControl sx={{ gap: 1 }}>
            <FormLabel htmlFor="email" sx={{ color: 'inherit' }}>{t("lecturer_register_page.student_register_email_label")} </FormLabel>
            <TextInput id="email" type="username" name="email" placeholder="name@fuqtr.ca" inputProps={{ maxLength: 50 }}
              autoComplete="email" required fullWidth variant="outlined" />
          </FormControl>

          <FormControl sx={{ gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="password" sx={{ color: 'inherit' }}>{t("lecturer_register_page.student_register_password_label")}</FormLabel>
            </Box>
            <TextInput name="password" placeholder="••••••" type="password" id="password" inputProps={{ maxLength: 25 }}
              autoComplete="current-password" required fullWidth variant="outlined"
              sx={{ color: '#000' }} />
          </FormControl>

          {/* <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 2 }}>
            <FormControl sx={{ gap: 1, width: '100%', flex: { xs: '100%', md: '0 0 65%' } }}>
              <FormLabel htmlFor="administrativeUnit" sx={{ color: 'inherit', display: 'block', textAlign: 'start' }}>Đơn vị trực thuộc</FormLabel>
              <Select
                id="administrativeUnit"
                name='administrativeUnit'
                sx={{
                  width: '100%',
                  '& .MuiSelect-icon': { color: '#000' }
                }}
              >
                <MenuItem key={'administrativeUnit_Khoa-cong-nghe-thong-tin'} value={'administrativeUnit_Khoa-cong-nghe-thong-tin'}>Khoa công nghệ thông tin</MenuItem>
                <MenuItem key={'administrativeUnit_Phong-cong-tac-sinh-vien'} value={'administrativeUnit_Phong-cong-tac-sinh-vien'}>Phòng công tác sinh viên</MenuItem>
                <MenuItem key={'administrativeUnit_Phong-dao-tao-khao-thi'} value={'administrativeUnit_Phong-dao-tao-khao-thi'}>Phòng đào tạo, khảo thí</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ gap: 1, width: '100%', flex: { xs: '100%', md: '1 1 100%' } }}>
              <FormLabel htmlFor="lecturerPosition" sx={{ color: 'inherit', display: 'block', textAlign: 'start' }}>Chức vụ</FormLabel>
              <Select
                id="lecturerPosition"
                name="lecturerPosition"
                sx={{
                  width: '100%',
                  '& .MuiSelect-icon': { color: '#000' },
                }}
              >
                <MenuItem key={'lecturerPosition_Truong-bo-mon'} value={'lecturerPosition_Truong-bo-mon'}>Trưởng bộ môn</MenuItem>
                <MenuItem key={'lecturerPosition_Giang-vien'} value={'lecturerPosition_Giang-vien'}>Giảng viên</MenuItem>
                <MenuItem key={'lecturerPosition_Tro-giang'} value={'lecturerPosition_Tro-giang'}>Trợ giảng</MenuItem>
                <MenuItem key={'lecturerPosition_Giao-vu'} value={'lecturerPosition_Giao-vu'}>Giáo vụ</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl sx={{ gap: 1 }}>
            <FormLabel htmlFor="teachingDepartment" sx={{ color: 'inherit', display: 'block', textAlign: 'start' }}>Bộ môn công tác (nếu có)</FormLabel>
            <Select
              id="teachingDepartment"
              name="teachingDepartment"
              defaultValue={'teachingDepartment_Khong-co'}
              sx={{
                width: '100%',
                '& .MuiSelect-icon': { color: '#000' },
              }}
            >
              <MenuItem key={'teachingDepartment_Cong-nghe-phan-mem'} value={'teachingDepartment'}>Công Nghệ Phần Mềm</MenuItem>
              <MenuItem key={'teachingDepartment_He-thong-thong-tin'} value={'teachingDepartment'}>Hệ Thống Thông Tin</MenuItem>
              <MenuItem key={'teachingDepartment_Khoa-hoc-may-tinh'} value={'teachingDepartment'}>Khoa Học Máy Tính</MenuItem>
              <MenuItem key={'teachingDepartment_Thi-giac-may-tinh'} value={'teachingDepartment'}>Thị Giác Máy Tính</MenuItem>
              <MenuItem key={'teachingDepartment_Cong-nghe-tri-thuc'} value={'teachingDepartment'}>Công Nghệ Tri Thức</MenuItem>
              <MenuItem key={'teachingDepartment_Cong-nghe-thong-tin'} value={'teachingDepartment'}>Công Nghệ Thông Tin </MenuItem>
              <MenuItem key={'teachingDepartment_Khong-co'} value={'teachingDepartment_Khong-co'}>Không có</MenuItem>
            </Select>
          </FormControl> */}


          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}
            sx={{ background: theme => theme.palette.primary.main, '&:hover': { boxShadow: 'var(--mui-shadows-4)' } }} >
            {t("lecturer_register_page.create_account_button")} </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ textAlign: 'center' }}>
              <span>
                <Link
                  // href="/signin"
                  onClick={() => navigate(`/signin`)}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  {t("lecturer_register_page.back_to_home")}
                </Link>
              </span>
            </Typography>
            <Typography sx={{ textAlign: 'center' }}>
              <span>
                <Link
                  // href="/register"
                  onClick={() => navigate(`/register`)}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  {t("lecturer_register_page.students_register_prompt")}
                </Link>
              </span>
            </Typography>
          </Box>


          {reducers_data?.captchaToken && <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <ReCAPTCHA
              sitekey={reducers_data?.captchaToken} // {import.meta.env.VITE_RESCAPTCHA_SITE_KEY}
              data-theme="dark"
              render="explicit"
              onChange={handleCaptchaChange}
              ref={recaptchaRef}
            />
          </Box>}

          <Typography sx={{ width: '100%', textAlign: 'end', color: 'red' }}>
            {notificationError}
          </Typography>
        </Box>

      </RegisterCard>
    </>
  )
}

export default RegisterAA
