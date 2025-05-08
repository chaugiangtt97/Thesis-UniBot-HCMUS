import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Avatar, Box, Chip, FormControl, FormLabel, Typography, TextField, Select, MenuItem, Backdrop, CircularProgress, Skeleton, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useProfile } from '~/apis/Profile';
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import MaleIcon from '@mui/icons-material/Male';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import dayjs from 'dayjs';
import { useCode } from '~/hooks/useMessage';
import Block from '~/components/Mui/Block';
import { getDate } from '~/utils/GetDate';
import { refresh } from '~/store/actions/authActions';

const Container_Style = { height: 'fit-content', paddingX:1, paddingY: 4,
  background: theme => theme.palette.mode == 'dark' ? '#3e436b' : '#7474742b'
 }

export function Profile() {

  const dispatch = useDispatch()

  const { processHandler, noticeHandler, dashboard } = useOutletContext()
  const [user, setUser] = useState(null)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    document.title = 'Chatbot - Thông Tin Cá Nhân';
    dashboard.navigate.active(912)

    return () => ( dashboard.navigate.active('#') )
  },[])

  useEffect(() => {
    token && getUser(token)
      .then((usr) => setUser(usr))
      .catch((err) => { console.error('Lấy Thông Tin User Thất Bại !') })
  },[token])

  const getUser = async (token) => {
    const eventID = processHandler.add('#GetUser')
    return useProfile.get(token).then(async(user) => {
      processHandler.remove('#GetUser', eventID); return user
    })
  }

  const updateClick = async (e) => {
    e.preventDefault()
    const updateUserEvent = processHandler.add('#UpdateUser')
    useProfile.update(user, token)
    .then(async (user) => {
      setUser(user)
      dispatch(refresh(token, {
        name: user?.name,
        role: user?.role,
        email: user?.email,
        academicInformation: user?.academicInformation,
        generalInformation: user?.generalInformation
      }))

      noticeHandler.add({
        status: 'success',
        message: 'Cập nhật thành công'
      })
    }).catch((err) => {
      noticeHandler.add({
        status: 'error',
        message: err
      })
      console.error('Cập Nhật Thông Tin User Thất Bại !')
    }).finally(() => processHandler.remove('#UpdateUser', updateUserEvent))
  }

  return (
    <Block className = 'Profile_Block' sx = { Container_Style }>
      
      <Box sx = {{  paddingX: 2,  display: 'flex', flexDirection: 'column', gap: 2  }}>
        { user && <>
        <Box sx = {{ width: '100%', height: '175px', display: 'flex', gap: 6, paddingX: 5 }}>
          <Box>
            <Avatar sx={{ background: '#eaeff1', height: '140px', width: '140px' }} 
            src={`/studentAvatar_${user.generalInformation?.sex}.png`} 
              // src = "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
              />
            
            <Chip label={user?.role ? user?.role.replace(/\b\w/g, char => char.toUpperCase()) : '#undefine'}  
              sx = {{ background: '#4d6b38', fontWeight: '600', cursor: 'pointer' }}/>
          </Box>


          <Box sx ={{  display: 'flex', position: 'relative', flexDirection: 'column', justifyContent:'center', width: '100%', minWidth: '600px', height: '100%' }}>
            <Typography sx = {{  fontSize: '1.525rem !important', fontWeight: '900',  width: 'fit-content' }}>
              {user?.name ? user.name : '#undefine'} </Typography>

            <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <MaleIcon sx = {{ fontSize: '1rem' }}/>
              <Typography sx = {{  width: 'fit-content' }}>
                <span style = {{ fontWeight: '600' }}>Giới tính : </span><span>{user?.generalInformation?.sex ? useCode(user?.generalInformation?.sex) : '#undefine'}</span> 
              </Typography>
            </Box>

            <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <HomeWorkOutlinedIcon sx = {{ fontSize: '1rem' }}/>
              <Typography sx = {{  width: 'fit-content' }}>
                  <span style = {{ fontWeight: '600' }}>Đơn vị trực thuộc : </span>{user?.department ? useCode(user.department) : '#undefine'}
              </Typography>
            </Box>

            <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocalPhoneOutlinedIcon sx = {{ fontSize: '1rem' }}/>
              <Typography sx = {{  width: 'fit-content' }}>
                <span style = {{ fontWeight: '600' }}>Bộ môn công tác: </span><span>{user?.phone ? user.phone : '#undefine'}</span>
              </Typography>
            </Box>

            <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <DraftsOutlinedIcon sx = {{ fontSize: '1rem' }}/>
              <Typography sx = {{ width: 'fit-content' }}>
                <span style = {{ fontWeight: '600' }}>Email Công Việc : </span>{user?.email ? user.email : '#undefine'}<span></span> ( Mặc Định )
              </Typography>
            </Box>

            <Typography sx = {{  width: 'fit-content', color: theme => theme.palette.mode == 'dark' ? '#0dff0d' : '#0dd60d' }}>
              {user?.message ? user.message : ''} </Typography>

          </Box>
        </Box>

        <Box sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'fit-content', gap: 1 }}>
          <PermIdentityOutlinedIcon sx = {{ fontSize: '2.225rem' }}/> 
          <Typography variant='h1' sx = {{  fontSize: '1.5rem', fontFamily: 'Roboto', fontWeight: '900', width: 'fit-content', lineHeight: '100%', }}>
            Chỉnh Sửa Thông Tin Cá Nhân</Typography>
        </Box>

        <Box sx = {{ width: '100%', backgroundColor: theme => theme.palette.mode == 'dark' ? 'rgb(73 96 135)' : '#fff', justifyContent: 'space-evenly', padding: 4, paddingBottom: 2, borderRadius: '15px', minWidth: '788px' }} component='form'>

          <Grid container spacing={2} sx = {{ width: '100%', height: 'fit-content' }}>

            <Grid size={6}>
              <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="name" sx = {{ color: 'inherit' }}>Họ Và Tên</FormLabel>
                </Box>
                <TextField
                  inputProps={{ maxLength: 25 }}
                  id="user_name"
                  required
                  spellCheck = { false }
                  fullWidth
                  variant="outlined"
                  value={user?.name ? user?.name : null}
                  onChange={(e) => setUser((prev) => ({...prev, name : e.target.value}))}
                />
              </FormControl>
            </Grid>

            <Grid size={2} offset={0.25}>
              <FormLabel htmlFor="password" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start'}}>Giới Tính</FormLabel>
              <Select
                id="user_sex"
                value={user?.generalInformation?.sex || ' '}
                sx = {{ width: '100%',
                  '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important'},
                  '& .MuiSelect-icon': { color: theme => theme.palette.text.secondary }
                }}
                onChange = {(e) => setUser((prevUserRecord) => {
                  return {...prevUserRecord, 
                    generalInformation: {
                    ...prevUserRecord?.generalInformation,
                    sex: e.target.value
                  }}
                })}
              >
                <MenuItem value={'female'}>Nữ</MenuItem>
                <MenuItem value={'male'}>Nam</MenuItem>
              </Select>
            </Grid>

            <Grid size={3.5} offset={0.25}>
              <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="birth" sx = {{ color: 'inherit' }}>Ngày Sinh</FormLabel>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']} sx = {{ paddingTop: 0, width: '100%' ,'& button' : { color: theme => theme.palette.text.secondary } }}>
                    <DatePicker
                      id="user_birth"
                      disabled
                      value={dayjs(user?.birth)}
                      onChange={(value) => setUser((prev) => ({...prev, birth : value}))} />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid size={6}>
              <Box sx={{ display: 'block', width: '100%' }}>
                <FormLabel htmlFor="administrativeUnit" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start' }}>Đơn vị công tác</FormLabel>
                <Select
                  id="administrativeUnit"
                  name= 'administrativeUnit'
                  value={user?.academicInformation?.administrativeUnit}
                  sx = {{ width: '100%',
                    '& .MuiSelect-icon': { color: theme => theme.palette.text.secondary }
                  }}
                  onChange = {(e) => setUser((prevUserRecord) => {
                    return {...prevUserRecord, 
                      academicInformation: {
                      ...prevUserRecord?.academicInformation,
                      administrativeUnit: e.target.value
                    }}
                  })}
                >
                <MenuItem key = {'administrativeUnit_Khoa-cong-nghe-thong-tin'} value={'administrativeUnit_Khoa-cong-nghe-thong-tin'}>Khoa công nghệ thông tin</MenuItem>
                <MenuItem key = {'administrativeUnit_Phong-cong-tac-sinh-vien'} value={'administrativeUnit_Phong-cong-tac-sinh-vien'}>Phòng công tác sinh viên</MenuItem>
                <MenuItem key = {'administrativeUnit_Phong-dao-tao-khao-thi'} value={'administrativeUnit_Phong-dao-tao-khao-thi'}>Phòng đào tạo, khảo thí</MenuItem>
                </Select>
              </Box>
            </Grid>

            <Grid size={3} offset={0}>
              <Box sx={{ display: 'block', width: '100%' }}>
                <FormLabel htmlFor="lecturerPosition" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start' }}>Chức Vụ</FormLabel>
                <Select
                  id="lecturerPosition"
                  name= "lecturerPosition"
                  value={user?.academicInformation?.lecturerPosition}
                  sx = {{ width: '100%',
                    '& .MuiSelect-icon': { color: theme => theme.palette.text.secondary },
                    borderRadius: '6px'
                  }}
                  onChange = {(e) => setUser((prevUserRecord) => {
                    return {...prevUserRecord, 
                      academicInformation: {
                      ...prevUserRecord?.academicInformation,
                      lecturerPosition: e.target.value
                    }}
                  })}
                >
                <MenuItem key = {'lecturerPosition_Truong-bo-mon'} value = {'lecturerPosition_Truong-bo-mon'}>Trưởng bộ môn</MenuItem>
                <MenuItem key = {'lecturerPosition_Giang-vien'} value = {'lecturerPosition_Giang-vien'}>Giảng viên</MenuItem>
                <MenuItem key = {'lecturerPosition_Tro-giang'} value = {'lecturerPosition_Tro-giang'}>Trợ giảng</MenuItem>
                <MenuItem key = {'lecturerPosition_Giao-vu'} value = {'lecturerPosition_Giao-vu'}>Giáo vụ</MenuItem>
                </Select>
              </Box>
            </Grid>

            <Grid size={7} offset={0}>
              <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="email" sx = {{ color: 'inherit' }}>Bộ môn công tác</FormLabel>
                </Box>
                <Select
                    id="teachingDepartment"
                    name= "teachingDepartment"
                    value={user?.academicInformation?.teachingDepartment}
                    defaultValue={'teachingDepartment_Khong-co'}
                    sx = {{ width: '100%',
                      '& .MuiSelect-icon': { color: '#000' },
                    }}
                    onChange = {(e) => setUser((prevUserRecord) => {
                      return {...prevUserRecord, 
                        academicInformation: {
                        ...prevUserRecord?.academicInformation,
                        teachingDepartment: e.target.value
                      }}
                    })}
                  >
                    <MenuItem key={'teachingDepartment_Cong-nghe-phan-mem'} value={'teachingDepartment'}>Công Nghệ Phần Mềm</MenuItem>
                    <MenuItem key={'teachingDepartment_He-thong-thong-tin'} value={'teachingDepartment'}>Hệ Thống Thông Tin</MenuItem>
                    <MenuItem key={'teachingDepartment_Khoa-hoc-may-tinh'} value={'teachingDepartment'}>Khoa Học Máy Tính</MenuItem>
                    <MenuItem key={'teachingDepartment_Thi-giac-may-tinh'} value={'teachingDepartment'}>Thị Giác Máy Tính</MenuItem>
                    <MenuItem key={'teachingDepartment_Cong-nghe-tri-thuc'} value={'teachingDepartment'}>Công Nghệ Tri Thức</MenuItem>
                    <MenuItem key={'teachingDepartment_Cong-nghe-thong-tin'} value={'teachingDepartment'}>Công Nghệ Thông Tin </MenuItem>
                    <MenuItem key={'teachingDepartment_Khong-co'} value={'teachingDepartment_Khong-co'}>Không có</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={5}>
              <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="personal_phone" sx = {{ color: 'inherit' }}>Số Điện Thoại</FormLabel>
                </Box>
                <TextField
                  inputProps={{ maxLength: 40 }}
                  id="personal_phone"
                  name= "personal_phone"
                  value={user?.phone}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setUser((prev) => ({...prev, phone : e.target.value}))}
                />
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="preferences" sx = {{ color: 'inherit' }}>Mô Tả Công Việc</FormLabel>
                </Box>
                <TextField
                  inputProps={{ maxLength: 200 }}
                  multiline
                  id="preferences"
                  name= "preferences"
                  value={user?.preferences}
                  spellCheck = {false}
                  rows={4}
                  onChange={(e) => setUser((prev) => ({...prev, preferences : e.target.value}))}
                />
              </FormControl>
            </Grid>

          </Grid>
          <Box >
            <Typography sx ={{ width: '100%', textAlign: 'end', marginTop: 2 }}>Cập nhật lần cuối vào lúc : {getDate(user?.updatedAt)}</Typography>
          </Box>
        </Box>

        <Box sx = {{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
          <Button variant= 'contained' color="success" onClick={updateClick}>Cập Nhật Thông Tin</Button>
          <Button variant= 'contained' color='error'>Đặt lại mật khẩu</Button>
        </Box>

      </> } </Box>

    </Block>
  )
}

export default Profile