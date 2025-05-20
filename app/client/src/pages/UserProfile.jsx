import { Button, Avatar, Box, Chip, FormControl, FormLabel, Typography, TextField, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Block from '~/components/Mui/Block';
import { navigate as sidebarAction } from '~/store/actions/navigateActions';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import MaleIcon from '@mui/icons-material/Male';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useCode } from '~/hooks/useMessage';
import { refresh } from '~/store/actions/authActions';
import { getDate } from '~/utils/GetDate';
import { useApi } from '~/apis/apiRoute';

export function UserProfile() {
  const dispatch = useDispatch()
  const [hide, setHide] = useState(true)
  const token = useSelector((state) => state.auth.token)
  const [user, setUser] = useState(useSelector((state) => state.auth.user))
  const [updateButtonActive, setUpdateButtonActive] = useState(true)

  useEffect(() => {
    document.title = 'Chatbot - Thông Tin Cá Nhân';
    dispatch(sidebarAction({index: 912}))

    useApi.get_profile(token).then((user) => {
      setUser(user)
      setHide(false)
    }).catch((err) => console.error('Lấy thông tin user thất bại!'))

    return () => (
      dispatch(sidebarAction({index: null}))
    )
  },[])

  const updateClick = async (e) => {
    e.preventDefault()
    setUpdateButtonActive(false)
    useApi.update_profile(token, user)
      .then((user) => {
        setUpdateButtonActive(true)
        setUser(user)
        dispatch( refresh(token, user) )
      })
      .catch((err) => console.error('update Thất bại  ', err))
  }

  return (
    <>
    <Block sx = {{ padding: '10px', paddingY: 3, }}>

      <Box sx = {{ 
        width: '100%',
        overflow: 'auto',
        paddingX: '10px',
        paddingX: 3,
      }}>

      <Box sx = {{ 
        width: '100%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingBottom: 2
       }}>

          <Box sx = {{  width: '100%', height: '160px', padding: '10px', display: 'flex', gap: 4, }}>
            <Avatar sx={{ background: '#6193a5', height: '140px', width: '140px' }} 
              src = "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"/>
            
            <Box sx ={{  display: 'flex', position: 'relative', flexDirection: 'column', width: '100%', minWidth: '600px', }}>
              <Typography sx = {{  fontSize: '1.525rem !important', fontWeight: '900',  width: 'fit-content' }}>
                {user?.name ? user.name : '#undefine'} </Typography>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <MaleIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{  width: 'fit-content' }}>
                  <span style = {{ fontWeight: '600' }}>Giới tính : </span><span>{user?.sex ? useCode(user.sex) : '#undefine'}</span> 
                </Typography>
              </Box>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <HomeWorkOutlinedIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{  width: 'fit-content' }}>
                   <span style = {{ fontWeight: '600' }}>Phòng Ban : </span>{user?.department ? useCode(user.department) : '#undefine'}
                </Typography>
              </Box>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <DraftsOutlinedIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{ width: 'fit-content' }}>
                  <span style = {{ fontWeight: '600' }}>Email Công Việc : </span>{user?.email ? user.email : '#undefine'}<span></span> ( Mặc Định )
                </Typography>
              </Box>

              <Box sx = {{  display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <LocalPhoneOutlinedIcon sx = {{ fontSize: '1rem' }}/>
                <Typography sx = {{  width: 'fit-content' }}>
                  <span style = {{ fontWeight: '600' }}>Số Điện Thoại: </span><span>{user?.phone ? user.phone : '#undefine'}</span>
                </Typography>
              </Box>

              <Typography sx = {{ 
                width: 'fit-content',
                color: theme => theme.palette.mode == 'dark' ? '#0dff0d' : '#0dd60d'
               }}>
                {user?.message ? user.message : ''}
              </Typography>

              <Chip label={user?.role ? user?.role.replace(/\b\w/g, char => char.toUpperCase()) : '#undefine'}  
                  sx = {{ position: 'absolute', right: 0,  top: 0, background: '#4d6b38', fontWeight: '600', cursor: 'pointer' }}/>
            </Box>

          </Box>

          <Box sx = {{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'fit-content',
            gap: 1
           }}>
            <PermIdentityOutlinedIcon sx = {{ fontSize: '2.225rem' }}/> 
            <Typography variant='h1' sx = {{ 
                fontSize: '1.5rem',
                fontFamily: 'Roboto',
                fontWeight: '900',
                width: 'fit-content',
                lineHeight: '100%',
              }}>Chỉnh Sửa Thông Tin Cá Nhân</Typography>
          </Box>

          <Box sx = {{ 
            width: '100%',
            backgroundColor: theme => theme.palette.mode == 'dark' ? '#ffffff2b' : '#fff',
            justifyContent: 'space-evenly',
            padding: 4,
            paddingBottom: 2,
            borderRadius: '15px',
            minWidth: '788px'
          }} component='form'>

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
                    fullWidth
                    variant="outlined"
                    value={user?.name ? user?.name : null}
                    onChange={(e) => setUser((prev) => ({...prev, name : e.target.value}))}
                    sx = {{ 
                      color: '#fff',
                      '& fieldset': {
                        borderColor: `#000 !important`,
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid size={2} offset={0.25}>
                <FormLabel htmlFor="password" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start'}}>Giới Tính</FormLabel>
                <Select
                  id="user_sex"
                  value={user?.sex ? user?.sex : null}
                  sx = {{ 
                    width: '100%',
                    '& fieldset': {
                      borderColor: theme => theme.palette.mode == 'dark' ? '-' :`#000 !important`,
                    },
                    '& .MuiSelect-icon': {
                      color: theme => theme.palette.text.secondary
                    }
                  }}
                  onChange={(e) => setUser((prev) => ({...prev, sex : e.target.value}))}
                >
                  <MenuItem value={'female'}>Nam</MenuItem>
                  <MenuItem value={'male'}>Nữ</MenuItem>
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
                        value={dayjs(user?.birth)}
                        onChange={(value) => setUser((prev) => ({...prev, birth : value}))}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              <Grid size={3}>
                <Box sx={{ display: 'block', width: 'fit-content', width: '100%' }}>
                  <FormLabel htmlFor="department" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start' }}>Phòng Ban</FormLabel>
                  <Select
                    id="user_department"
                    name= 'department'
                    value={user?.department}
                    // disabled
                    sx = {{ 
                      width: '100%',
                      '& fieldset': {
                        borderColor: theme => theme.palette.mode == 'dark' ? '-' :`#000 !important`,
                      },
                      '& .MuiSelect-icon': {
                        color: theme => theme.palette.text.secondary
                      }
                    }}
                    onChange={(e) => setUser((prev) => ({...prev, department : e.target.value}))}
                  >
                    <MenuItem value={'DEPT-GV'}>Ban Giáo Vụ</MenuItem>
                    <MenuItem value={'DEPT-CTSV'}>Phòng Công Tác Sinh Viên</MenuItem>
                    <MenuItem value={'DEPT-HTTT'}>Văn Phòng Khoa Hệ Thống Thông Tin</MenuItem>
                    <MenuItem value={'DEPT-DT'}>Phòng Đào Tạo</MenuItem>
                  </Select>
                </Box>
              </Grid>

              <Grid size={3} offset={0}>
                <Box sx={{ display: 'block', width: 'fit-content', width: '100%' }}>
                  <FormLabel htmlFor="user_position" sx = {{ color: 'inherit', display: 'block' , marginBottom: 1, textAlign: 'start' }}>Chức Vụ</FormLabel>
                  <Select
                    id="user_position"
                    name= "user_position"
                    value={user?.position}
                    // disabled
                    sx = {{ 
                      width: '100%',
                      '& fieldset': {
                        borderColor: theme => theme.palette.mode == 'dark' ? '-' :`#000 !important`,
                      },
                      '& .MuiSelect-icon': {
                        color: theme => theme.palette.text.secondary
                      }
                    }}
                    onChange={(e) => setUser((prev) => ({...prev, position : e.target.value}))}
                  >
                    <MenuItem value={'ROLE-TP'}>Trưởng Phòng</MenuItem>
                    <MenuItem value={'ROLE-PP'}>Phó Phòng</MenuItem>
                    <MenuItem value={'ROLE-NV'}>Giáo Viên</MenuItem>
                    <MenuItem value={'ROLE-CTV'}>Cộng Tác Viên</MenuItem>
                  </Select>
                </Box>
              </Grid>

              <Grid size={7} offset={0}>
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
                    sx = {{ 
                      color: '#fff',
                      '& fieldset': {
                        borderColor: `#000 !important`,
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid size={7}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="personal_email" sx = {{ color: 'inherit' }}>Email Cá Nhân</FormLabel>
                  </Box>
                  <TextField
                    inputProps={{ maxLength: 40 }}
                    id="personal_email"
                    name= "personal_email"
                    value={user?.personal_email}
                    fullWidth
                    variant="outlined"
                    sx = {{ 
                      color: '#fff',
                      '& fieldset': {
                        borderColor: `#000 !important`,
                      },
                    }}
                    onChange={(e) => setUser((prev) => ({...prev, personal_email : e.target.value}))}
                  />
                </FormControl>
              </Grid>

              <Grid size={12}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '70%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="personal_phone" sx = {{ color: 'inherit' }}>Số Điện Thoại</FormLabel>
                  </Box>
                  <TextField
                    inputProps={{ maxLength: 12 }}
                    id="personal_phone"
                    name= "personal_phone"
                    value={user?.phone}
                    fullWidth
                    variant="outlined"
                    sx = {{ 
                      color: '#fff',
                      '& fieldset': {
                        borderColor: `#000 !important`,
                      },
                    }}
                    onChange={(e) => setUser((prev) => ({...prev, phone : e.target.value}))}
                  />
                </FormControl>
              </Grid>

              <Grid size={12}>
                <FormControl  sx={{gap: 1, display: 'flex', width: '100%'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="preferences" sx = {{ color: 'inherit' }}>Mục Tiêu Công Việc</FormLabel>
                  </Box>
                  <TextField
                    inputProps={{ maxLength: 200 }}
                    multiline
                    id="preferences"
                    name= "preferences"
                    value={user?.preferences}
                    rows={4}
                    onChange={(e) => setUser((prev) => ({...prev, preferences : e.target.value}))}
                    sx = {{ 
                      color: '#fff',
                      '& fieldset': {
                        borderColor: `#000 !important`,
                      },
                    }}
                  />
                </FormControl>
              </Grid>

            </Grid>
          <Box >
            <Typography sx ={{ 
              width: '100%',
              textAlign: 'end',
              marginTop: 2,
              color: theme => theme.palette.mode == 'dark' ? '#fff' : '#000'
             }}>Cập nhật lần cuối vào lúc : {getDate(user?.updatedAt)}</Typography>
          </Box>
          </Box>


          <Box sx = {{ 
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            width: '100%'
           }}>
            <Button variant= 'contained' color="success" onClick={updateClick}>Cập Nhật Thông Tin</Button>
            <Button variant= 'contained' color='error'>Đặt lại mật khẩu</Button>
          </Box>
      </Box>

      </Box>
    </Block>
    </>
  )
}

export default UserProfile