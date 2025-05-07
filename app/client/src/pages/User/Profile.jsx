import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Avatar, Box, Chip, FormControl, FormLabel, Typography, TextField, Select, MenuItem, Backdrop, CircularProgress, Skeleton, Button, styled } from '@mui/material';
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
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import dayjs from 'dayjs';
import { useCode } from '~/hooks/useMessage';
import Block from '~/components/Mui/Block';
import { getDate } from '~/utils/GetDate';
import { refresh } from '~/store/actions/authActions';
const Container_Style = { height: 'fit-content', paddingX:1, paddingY: 4,
  background: theme => theme.palette.mode == 'dark' ? '#3e436b' : '#7474742b',
  minWidth: {md: '900px', xs: ''},
  width: {md: '70vw', xs: '90vw', lg: '50vw', xl: '40vw'},
 }

export function Profile() {

  const dispatch = useDispatch()

  const { processHandler, noticeHandler, getModal } = useOutletContext()
  const [user, setUser] = useState(null)
  const [interest, setInterest] = useState(['student_handbook'])
  const token = useSelector((state) => state.auth.token)

  const [updateUser, setUpdateUser] = useState({})

  const interestList = [
    {
      id: 'student_handbook',
      text: 'Thông Tin Sổ Tay Sinh Viên'
    },
    {
      id: 'recruitment',
      text: 'Thông Tin Tuyển Dụng'
    },
    {
      id: 'timetable',
      text: 'Tra Cứu Thời Khóa Biểu'
    },
    {
      id: 'events',
      text: 'Thông Tin Sự Kiện'
    },
    {
      id: 'academic_affairs',
      text: 'Tra Cứu Nội Quy Trường Học'
    },
    {
      id: 'scholarship',
      text: 'Chính Sách Học Bổng'
    },
  ]

  useEffect(() => {
    token && getUser(token)
      .then((usr) => { setUser(usr), usr.interest ? setInterest(usr.interest) : setInterest([])})
      .catch((err) => { console.error("Lấy Thông Tin User Thất Bại !") })
  },[token])

  const getUser = async (token) => {
    const eventID = processHandler.add('#GetUser')
    return useProfile.get(token).then(async(user) => {
      processHandler.remove('#GetUser', eventID)
      console.log(user)
      return user
    })
  }

  const updateClick = async (e) => {
    e.preventDefault()
    const updateUserEvent = processHandler.add('#UpdateUser')
    useProfile.update({...user, interest }, token)
    .then(async (user) => {
      setUser(user)
      dispatch(refresh(token, {
        name: user?.name,
        role: user?.role,
        email: user?.email
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

  const chipClick = (id) => {
    setInterest(prevs => {
      if(id == 'student_handbook') return prevs
      if(prevs.length > 0 && prevs.includes(id)) {
        return prevs.filter((prev) => prev != id)
      }
      return prevs.concat(id)
    })
  }

  return (
    <Box sx = {{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: 2 }}>
      <Block className = 'Profile_Container' sx = { Container_Style }>
        
        <Box sx = {{  paddingX: {md: 2, xs: 0},  display: 'flex', flexDirection: 'column', gap: 2  }}>
          { user && <>
          <Box sx = {{ width: '100%', height: {md: '175px', xs: 'fit-content'}, display: {md: 'flex', xs: 'block'}, gap: 6, paddingX: {md: 5, xs: 0} }}>
            <Box sx = {{ display: { xs: 'flex', md: 'auto' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {/* <Avatar sx={{ background: '#6193a5', height: '140px', width: '140px' }}  */}
                {/* src = "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"/> */}
              
              <Avatar sx={{ background: '#eaeff1', height: '140px', width: '140px' }} 
                src={`/studentAvatar_${user.generalInformation?.sex}.png`} />
                
              {/* <Chip label={user?.role ? user?.role.replace(/\b\w/g, char => char.toUpperCase()) : '#undefine'}  
                sx = {{ background: '#4d6b38', fontWeight: '600', cursor: 'pointer' }}/> */}
            </Box>


            <Box sx ={{  display: 'flex', position: 'relative', flexDirection: 'column', justifyContent:'center', alignItems: {xs: 'center', md: 'start'}, width: '100%', minWidth: {md: '600px', xs: 'auto' }, height: '100%' }}>
              <Typography sx = {{  fontSize: '1.525rem !important', fontWeight: '900',  width: 'fit-content' }}>
                {user?.name ? user.name : '#undefine'} </Typography>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AccountBalanceWalletOutlinedIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{  width: 'fit-content' }}>
                    <span style = {{ fontWeight: '600' }}>Hệ Đào Tạo : </span>{user?.academicInformation.trainingProgram ? useCode(user.academicInformation.trainingProgram) : '#undefine'}
                </Typography>
              </Box>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AdjustOutlinedIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{  width: 'fit-content' }}>
                    <span style = {{ fontWeight: '600' }}>Khóa Đào Tạo : </span>{user?.academicInformation.trainingBatch ? useCode(user.academicInformation.trainingBatch) : '#undefine'}
                </Typography>
              </Box>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AnnouncementOutlinedIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{  width: 'fit-content' }}>
                    <span style = {{ fontWeight: '600' }}>Chuyên Ngành Đào Tạo : </span>{user?.academicInformation.selectedMajor ? useCode(user.academicInformation.selectedMajor) : '#undefine'}
                </Typography>
              </Box>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <DraftsOutlinedIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{ width: 'fit-content' }}>
                  <span style = {{ fontWeight: '600' }}>Email : </span>{user?.email ? user.email : '#undefine'}<span></span> ( Mặc Định )
                </Typography>
              </Box>

              <Typography sx = {{  width: 'fit-content', color: theme => theme.palette.mode == 'dark' ? '#0dff0d' : '#0dd60d' }}>
                {user?.message ? user.message : ''} </Typography>

            </Box>
          </Box>

          <Box sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'fit-content', gap: 1 }}>
            <PermIdentityOutlinedIcon sx = {{ fontSize: '2.225rem' }}/> 
            <Typography variant='h1' sx = {{  fontSize: {md: '1.5rem', xs: '1.2rem'}, fontFamily: 'Roboto', fontWeight: '900', width: 'fit-content', lineHeight: '100%', }}>
              Chỉnh Sửa Thông Tin Cá Nhân</Typography>
          </Box>

          <Box sx = {{ width: '100%', backgroundColor: theme => theme.palette.mode == 'dark' ? 'rgb(73 96 135)' : '#fff', justifyContent: 'space-evenly', padding: {md: 4, xs: 2}, paddingBottom: 2, borderRadius: '15px', minWidth: { md: '788px', xs: 'auto' } }} component='form'>

            <Grid container spacing={2} sx = {{ width: '100%', height: 'fit-content' }}>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="name" sx = {{ color: 'inherit' }}>Họ Và Tên</FormLabel>
                  </Box>
                  <TextField
                    inputProps={{ maxLength: 50 }}
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

              <Grid size={{ xs: 12, md: 2 }} offset={0.25}>
                <FormLabel htmlFor="password" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start'}}>Giới Tính</FormLabel>
                <Select
                  id="user_sex"
                  value={user?.generalInformation?.sex || ' '}
                  sx = {{ width: '100%',
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
                  <MenuItem key={'female'} value={'female'}>Nữ</MenuItem>
                  <MenuItem key={'male'} value={'male'}>Nam</MenuItem>
                  <MenuItem key={' '} value={' '}></MenuItem>
                </Select>
              </Grid>

              <Grid size={{ xs: 12, md: 3.5 }} offset={0.25}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="birth" sx = {{ color: 'inherit' }}>Ngày Sinh</FormLabel>
                  </Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} 
                      sx = {{ 
                        paddingTop: 0, 
                        width: '100%',
                        '& button' : { 
                          color: theme => theme.palette.text.secondary 
                        }
                      }}>
                      <DatePicker
                        id="user_birth"
                        value={dayjs(user?.generalInformation?.birth || ' ')}
                        onChange = {(e) => setUser((prevUserRecord) => {
                          return {...prevUserRecord, 
                            generalInformation: {
                            ...prevUserRecord?.generalInformation,
                            birth: e.target.value
                          }}
                        })}
                        sx = {{ 
                          '--mui-palette-text-secondary': '#000',
                          '& MuiTypography-root MuiTypography-caption MuiDayCalendar-weekDayLabel': {
                            color: '#000 !important'
                          } 
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ display: 'block', width: '100%' }}>
                  <FormLabel htmlFor="trainingProgram" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start' }}>Chương Trình Đào Tạo</FormLabel>
                  <Select
                    id="trainingProgram"
                    name= 'trainingProgram'
                    value={user?.academicInformation.trainingProgram || ' '}
                    sx = {{ width: '100%', color: '#000', '& .MuiSelect-icon': { color:'#000' }}}
                    onChange = {(e) => setUser((prevUserRecord) => {
                      return {...prevUserRecord, 
                        academicInformation: {
                        ...prevUserRecord.academicInformation,
                        trainingProgram: e.target.value
                      }}
                    })}
                  >
                    <MenuItem key={'trainingProgram_Dai-Tra'} value={'trainingProgram_Dai-Tra'}>Chương trình Đại Trà</MenuItem>
                    <MenuItem key={'trainingProgram_Chat-Luong-Cao'} value={'trainingProgram_Chat-Luong-Cao'}>Chương trình Chất Lượng Cao</MenuItem>
                    <MenuItem key={'trainingProgram_Cu_Nhan_Tai_Nang'} value={'trainingProgram_Cu_Nhan_Tai_Nang'}>Chương trình Cử Nhân Tài Năng</MenuItem>
                    <MenuItem key={'trainingProgram_Viet-Phap'} value={'trainingProgram_Viet-Phap'}>Chương trình Việt Pháp</MenuItem>
                    <MenuItem value=" "></MenuItem>
                  </Select>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} offset={0}>
                <Box sx={{ display: 'block', width: '100%' }}>
                  <FormLabel htmlFor="trainingBatch" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start' }}>Khóa Đào Tạo</FormLabel>
                  <Select
                    id="trainingBatch"
                    name= 'trainingBatch'
                    value={user?.academicInformation.trainingBatch || ' '}
                    sx = {{ width: '100%', color: '#000', '& .MuiSelect-icon': { color:'#000' }}}
                    onChange = {(e) => setUser((prevUserRecord) => {
                      return {...prevUserRecord, 
                        academicInformation: {
                        ...prevUserRecord.academicInformation,
                        trainingBatch: e.target.value
                      }}
                    })}
                  >
                    <MenuItem value={'trainingBatch_K19'} key={'trainingBatch_K19'}>Khóa trước 2020</MenuItem>
                    <MenuItem value={'trainingBatch_K20'} key={'trainingBatch_K20'}>Khóa K2020</MenuItem>
                    <MenuItem value={'trainingBatch_K21'} key={'trainingBatch_K21'}>Khóa K2021</MenuItem>
                    <MenuItem value={'trainingBatch_K22'} key={'trainingBatch_K22'}>Khóa K2022</MenuItem>
                    <MenuItem value={'trainingBatch_K23'} key={'trainingBatch_K23'}>Khóa K2023</MenuItem>
                    <MenuItem value={'trainingBatch_K24'} key={'trainingBatch_K24'}>Khóa K2024</MenuItem>
                    <MenuItem value={'trainingBatch_K25'} key={'trainingBatch_K25'}>Khóa K2025</MenuItem>
                    <MenuItem value=" "></MenuItem>
                  </Select>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }} offset={0}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="email" sx = {{ color: 'inherit' }}>Email Công Việc</FormLabel>
                  </Box>
                  <TextField
                    inputProps={{ maxLength: 40 }}
                    required
                    id="user_email"
                    name= "user_email"
                    value={user?.email + ' ( Mặc Định ) '}
                    disabled
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="personal_phone" sx = {{ color: 'inherit' }}>Số Điện Thoại</FormLabel>
                  </Box>
                  <TextField
                    inputProps={{ maxLength: 10 }}
                    id="personal_phone"
                    name= "personal_phone"
                    value={user?.generalInformation?.personal_phone}
                    fullWidth
                    variant="outlined"
                    onChange = {(e) => setUser((prevUserRecord) => {
                      return {...prevUserRecord, 
                        generalInformation: {
                        ...prevUserRecord?.generalInformation,
                        personal_phone: e.target.value
                      }}
                    })}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ display: 'block', width: '100%' }}>
                  <FormLabel htmlFor="selectedMajor" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start' }}>Chuyên Ngành</FormLabel>
                  <Select
                    id="selectedMajor"
                    name= 'selectedMajor'
                    value={user?.academicInformation.selectedMajor || ' '}
                    sx = {{ width: '100%', color: '#000', '& .MuiSelect-icon': { color:'#000' }}}
                    onChange = {(e) => setUser((prevUserRecord) => {
                      return {...prevUserRecord, 
                        academicInformation: {
                        ...prevUserRecord.academicInformation,
                        selectedMajor: e.target.value
                      }}
                    })}
                  >
                    <MenuItem key={'selectedMajor_Cong-nghe-phan-mem'} value={'selectedMajor_Cong-nghe-phan-mem'}>Công Nghệ Phần Mềm</MenuItem>
                    <MenuItem key={'selectedMajor_He-thong-thong-tin'} value={'selectedMajor_He-thong-thong-tin'}>Hệ Thống Thông Tin</MenuItem>
                    <MenuItem key={'selectedMajor_Khoa-hoc-may-tinh'} value={'selectedMajor_Khoa-hoc-may-tinh'}>Khoa Học Máy Tính</MenuItem>
                    <MenuItem key={'selectedMajor_Thi-giac-may-tinh'} value={'selectedMajor_Thi-giac-may-tinh'}>Thị Giác Máy Tính</MenuItem>
                    <MenuItem key={'selectedMajor_Cong-nghe-tri-thuc'} value={'selectedMajor_Cong-nghe-tri-thuc'}>Công Nghệ Tri Thức</MenuItem>
                    <MenuItem key={'selectedMajor_Cong-nghe-thong-tin'} value={'selectedMajor_Cong-nghe-thong-tin'}>Công Nghệ Thông Tin </MenuItem>
                    <MenuItem key={'selectedMajor_Khong-co'} value={'selectedMajor_Khong-co'}>Không có - chưa xét chuyên ngành</MenuItem>
                    <MenuItem value=" "></MenuItem>
                  </Select>
                </Box>
              </Grid>

              <Grid size={12}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="preferences" sx = {{ color: 'inherit' }}>Chủ Đề Quan Tâm</FormLabel>
                  </Box>
                  <Box sx = {{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {interestList.map((data, _index) => {
                      return <>
                      <Chip key = {_index*1425346} label= {data.text} onClick={() => chipClick(data.id)}
                        color= { (data?.id == 'student_handbook' || interest.includes(data.id)) ? 'info' : ''}
                        sx = {{ 
                          '--mui-palette-action-selected': theme => theme.palette.mode == 'dark' ? 'rgb(255 255 255 / 0%)' : '#fff',
                          border: '1px solid #ccc' ,
                          color: theme => data?.id == 'student_handbook' || interest.includes(data.id) ? '#ffffff' : theme.palette.text.secondary,
                        }} />
                      </>
                    })}
                  </Box>
                </FormControl>
              </Grid>

            </Grid>
            <Box >
              <Typography sx ={{ width: '100%', textAlign: 'end', marginTop: 2 }}>Cập nhật lần cuối vào lúc : {getDate(user?.updatedAt)}</Typography>
            </Box>
          </Box>

          <Box sx = {{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%', paddingTop: 1 }}>
            <Button variant= 'contained' color="success" onClick={updateClick}>Cập Nhật Thông Tin</Button>

            <Button 
            onClick={() => getModal('Đặt Lại Mật Khẩu', 
              <Box component="form" 
                sx= {{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, position: 'relative', color: theme => theme.palette.primary.main }}>
                <FormControl  sx={{gap: 1}}>
                  <FormLabel htmlFor="current_password" sx = {{ color: 'inherit' }}>Mật khẩu hiện tại</FormLabel>
                  <TextInput name="current_password" placeholder="••••••" type="password" id="current_password"
                    onChange = {(e) => { setUpdateUser((prev) => {
                      return {...prev, current_password: e.target.value}
                    }) }}
                    autoComplete="password" required fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
                    sx = {{ color: '#000' }} />
                </FormControl>   
                <FormControl  sx={{gap: 1}}>
                  <FormLabel htmlFor="newPassword" sx = {{ color: 'inherit' }}>Mật khẩu mới</FormLabel>
                  <TextInput name="newPassword" placeholder="••••••" type="password" id="newPassword"
                    onChange = {(e) => { setUpdateUser((prev) => {
                      return {...prev, newPassword: e.target.value}
                    }) }}
                    required fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
                    sx = {{ color: '#000', minWidth: '30vw', width: '100%' }} />
                </FormControl>  

                <FormControl  sx={{gap: 1}}>
                  <FormLabel htmlFor="newPassword_2" sx = {{ color: 'inherit' }}>Mật khẩu mới ( Xác Nhận )</FormLabel>
                  <TextInput name="newPassword_2" placeholder="••••••" type="password" id="newPassword_2"
                    onChange = {(e) => { setUpdateUser((prev) => {
                      return {...prev, newPassword_2: e.target.value}
                    }) }}
                    required fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
                    sx = {{ color: '#000' }} />
                </FormControl>  
              </Box>,
              'Đặt Lại Mật Khẩu', 
              () => {
                console.log(updateUser)
                if (!updateUser?.password) {
                  noticeHandler.add({
                    status: 'error',
                    message: 'Vui lòng nhập mật khẩu hiện tại !'
                  })
                  return
                }

                if (!updateUser?.newPassword || !updateUser?.newPassword_2 || updateUser?.newPassword < 6) {
                  noticeHandler.add({
                    status: 'error',
                    message: 'Mật khẩu phải chứa tối đa 6 kí tự !'
                  })
                  return
                }

                if ( updateUser?.newPassword != updateUser?.newPassword_2) {
                  noticeHandler.add({
                    status: 'error',
                    message: 'Mật khẩu không khớp !'
                  })
                  return
                }
                
                const ResetPasswordEvent =  processHandler.add('#ResetPassword')
                useProfile.updatePassword({
                  email: user?.email,
                  password: updateUser?.current_password,
                  newPassword: updateUser?.newPassword,
                },token).then(() => {
                  noticeHandler.add({
                    status: 'success',
                    message: 'Đặt lại mật khẩu thành công !'
                  })
                }).catch((err) => {
                  noticeHandler.add({
                    status: 'error',
                    message: err
                  })
                }).finally(() => processHandler.remove('#ResetPassword', ResetPasswordEvent))
              }, { content : null, props: null })}
            variant= 'contained' color='error'>Đặt lại mật khẩu</Button>
          </Box>

        </> } </Box>

      </Block>
    </Box>
  )
}

export default Profile



const TextInput = styled(TextField) (({ theme }) => ({
  '& input': { color: '#000' }, WebkitTextFillColor: '#000', 
  '&:hover fieldset': { borderColor: `${theme.palette.primary.main} !important` }
}));