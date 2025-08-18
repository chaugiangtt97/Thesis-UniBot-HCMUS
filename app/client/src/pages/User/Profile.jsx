import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { Box, Chip, FormControl, FormLabel, Typography, TextField, Select, MenuItem, Backdrop, CircularProgress, Skeleton, Button, styled } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
import AvatarUserDefault from '~/components/Avatar/AvatarUserDefault';
import { useApi } from '~/apis/apiRoute';
import { useTranslation } from 'react-i18next';
const Container_Style = {
  height: 'fit-content', paddingX: 1, paddingY: 4,
  background: theme => theme.palette.mode == 'dark' ? '#3e436b' : '#7474742b',
  minWidth: { md: '900px', xs: '' },
  width: { md: '70vw', xs: '90vw', lg: '50vw', xl: '40vw' },
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
      text: t("user_profile.student_handbook_info")//'Thông Tin Sổ Tay Sinh Viên'
    },
    {
      id: 'recruitment',
      text: t("user_profile.recruitment_info")//'Thông Tin Tuyển Dụng'
    },
    {
      id: 'timetable',
      text: t("user_profile.timetable_lookup")//'Tra Cứu Thời Khóa Biểu'
    },
    {
      id: 'events',
      text: t("user_profile.event_info")//'Thông Tin Sự Kiện'
    },
    {
      id: 'academic_affairs',
      text: t("user_profile.school_rules_lookup")//'Tra Cứu Nội Quy Trường Học'
    },
    {
      id: 'scholarship',
      text: t("user_profile.scholarship_policy")//'Chính Sách Học Bổng'
    },
  ]

  useEffect(() => {
    token && getUser(token)
      .then((usr) => { setUser(usr), usr.interest ? setInterest(usr.interest) : setInterest([]) })
      .catch((err) => { console.error(t("user_profile.student_handbook")) })//"Lấy Thông Tin User Thất Bại !"
  }, [token])

  const getUser = async (token) => {
    const eventID = processHandler.add('#GetUser')
    return useApi.get_profile(token).then(async (user) => {
      processHandler.remove('#GetUser', eventID)
      return user
    })
  }

  const updateClick = async (e) => {
    e.preventDefault()
    const updateUserEvent = processHandler.add('#UpdateUser')
    useApi.update_profile(token, { ...user, interest })
      .then(async (user_profile) => {
        setUser(user)
        dispatch(refresh(token, user_profile))
        noticeHandler.add({ status: 'success', message: t("user_profile.update_success") })//'Cập nhật thành công'
      })
      .catch((err) => noticeHandler.add({ status: 'error', message: err }))
      .finally(() => processHandler.remove('#UpdateUser', updateUserEvent))
  }

  const chipClick = (id) => {
    setInterest(prevs => {
      if (id == 'student_handbook') return prevs
      if (prevs.length > 0 && prevs.includes(id)) {
        return prevs.filter((prev) => prev != id)
      }
      return prevs.concat(id)
    })
  }

  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: 2 }}>
      <Block className='Profile_Container' sx={Container_Style}>

        <Box sx={{ paddingX: { md: 2, xs: 0 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {user && <>
            <Box sx={{ width: '100%', height: { md: '175px', xs: 'fit-content' }, display: { md: 'flex', xs: 'block' }, gap: 6, paddingX: { md: 5, xs: 0 } }}>
              <Box sx={{ display: { xs: 'flex', md: 'auto' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <AvatarUserDefault sx={{ width: '140px', height: '140px', display: { xs: 'none', md: 'block' } }} />
              </Box>

              <Box sx={{ display: 'flex', position: 'relative', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', md: 'start' }, width: '100%', minWidth: { md: '600px', xs: 'auto' }, height: '100%' }}>
                <Typography sx={{ fontSize: '1.525rem !important', fontWeight: '900', width: 'fit-content' }}>
                  {user?.name ? user.name : '#undefine'} </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AccountBalanceWalletOutlinedIcon sx={{ fontSize: '1rem' }} />
                  <Typography sx={{ width: 'fit-content' }}>
                    <span style={{ fontWeight: '600' }}>{t("user_profile.education_system")} : </span>{user?.academicInformation.trainingProgram ? useCode(user.academicInformation.trainingProgram) : '#undefine'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AdjustOutlinedIcon sx={{ fontSize: '1rem' }} />
                  <Typography sx={{ width: 'fit-content' }}>
                    <span style={{ fontWeight: '600' }}>{t("user_profile.training_course")} : </span>{user?.academicInformation.trainingBatch ? useCode(user.academicInformation.trainingBatch) : '#undefine'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AnnouncementOutlinedIcon sx={{ fontSize: '1rem' }} />
                  <Typography sx={{ width: 'fit-content' }}>
                    <span style={{ fontWeight: '600' }}>{t("user_profile.training_major")} : </span>{user?.academicInformation.selectedMajor ? useCode(user.academicInformation.selectedMajor) : '#undefine'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <DraftsOutlinedIcon sx={{ fontSize: '1rem' }} />
                  <Typography sx={{ width: 'fit-content' }}>
                    <span style={{ fontWeight: '600' }}>Email : </span>{user?.email ? user.email : '#undefine'}<span></span> ( Default )
                  </Typography>
                </Box>

                <Typography sx={{ width: 'fit-content', color: theme => theme.palette.mode == 'dark' ? '#0dff0d' : '#0dd60d' }}>
                  {user?.message ? user.message : ''} </Typography>

              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'fit-content', gap: 1 }}>
              <PermIdentityOutlinedIcon sx={{ fontSize: '2.225rem' }} />
              <Typography variant='h1' sx={{ fontSize: { md: '1.5rem', xs: '1.2rem' }, fontFamily: 'Roboto', fontWeight: '900', width: 'fit-content', lineHeight: '100%', }}>{t("user_profile.edit_personal_info")}</Typography>
            </Box>

            <Box sx={{ width: '100%', backgroundColor: theme => theme.palette.mode == 'dark' ? 'rgb(73 96 135)' : '#fff', justifyContent: 'space-evenly', padding: { md: 4, xs: 2 }, paddingBottom: 2, borderRadius: '15px', minWidth: { md: '788px', xs: 'auto' } }} component='form'>

              <Grid container spacing={2} sx={{ width: '100%', height: 'fit-content' }}>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl sx={{ gap: 1, display: 'flex', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <FormLabel htmlFor="name" sx={{ color: 'inherit' }}>{t("user_profile.full_name")}</FormLabel>
                    </Box>
                    <TextField
                      inputProps={{ maxLength: 50 }}
                      id="user_name"
                      required
                      spellCheck={false}
                      fullWidth
                      variant="outlined"
                      value={user?.name ? user?.name : null}
                      onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                      sx={{
                        '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 2 }} offset={0.25}>
                  <FormLabel htmlFor="password" sx={{ color: 'inherit', display: 'block', marginBottom: 1, textAlign: 'start' }}>{t("user_profile.gender")}</FormLabel>
                  <Select
                    id="user_sex"
                    value={user?.generalInformation?.sex || ' '}
                    sx={{
                      width: '100%',
                      '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' },
                      '& .MuiSelect-icon': { color: theme => theme.palette.text.secondary }
                    }}
                    onChange={(e) => setUser((prevUserRecord) => {
                      return {
                        ...prevUserRecord,
                        generalInformation: {
                          ...prevUserRecord?.generalInformation,
                          sex: e.target.value
                        }
                      }
                    })}
                  >
                    <MenuItem key={'female'} value={'female'}>Nữ</MenuItem>
                    <MenuItem key={'male'} value={'male'}>Nam</MenuItem>
                    <MenuItem key={' '} value={' '}></MenuItem>
                  </Select>
                </Grid>

                <Grid size={{ xs: 12, md: 3.5 }} offset={0.25}>
                  <FormControl sx={{ gap: 1, display: 'flex', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <FormLabel htmlFor="birth" sx={{ color: 'inherit' }}>{t("user_profile.date_of_birth")}</FormLabel>
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}
                        sx={{
                          paddingTop: 0,
                          width: '100%',
                          '& button': {
                            color: theme => theme.palette.text.secondary
                          }
                        }}>
                        <DatePicker
                          id="user_birth"
                          disabled
                          value={dayjs(user?.generalInformation?.birth || ' ')}
                          onChange={(e) => setUser((prevUserRecord) => {
                            return {
                              ...prevUserRecord,
                              generalInformation: {
                                ...prevUserRecord?.generalInformation,
                                birth: e.target.value
                              }
                            }
                          })}
                          sx={{
                            '--mui-palette-text-secondary': theme => theme.palette.mode == 'dark' ? '#fff' : '#000',
                            '& MuiTypography-root MuiTypography-caption MuiDayCalendar-weekDayLabel': {
                              color: theme => theme.palette.mode == 'dark' ? '#fff !important' : '#000 !important',
                            },
                            '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' }
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ display: 'block', width: '100%' }}>
                    <FormLabel htmlFor="trainingProgram" sx={{ color: 'inherit', display: 'block', marginBottom: 1, textAlign: 'start' }}>{t("user_profile.training_program")}</FormLabel>
                    <Select
                      id="trainingProgram"
                      name='trainingProgram'
                      value={user?.academicInformation.trainingProgram || ' '}
                      sx={{
                        width: '100%',
                        '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' },
                        color: theme => theme.palette.mode == 'dark' ? '#fff' : '#000', '& .MuiSelect-icon': { color: theme => theme.palette.mode == 'dark' ? '#fff' : '#000' }
                      }}
                      onChange={(e) => setUser((prevUserRecord) => {
                        return {
                          ...prevUserRecord,
                          academicInformation: {
                            ...prevUserRecord.academicInformation,
                            trainingProgram: e.target.value
                          }
                        }
                      })}
                    >
                      <MenuItem key={'trainingProgram_Dai-Tra'} value={'trainingProgram_Dai-Tra'}>{t("user_profile.general_program")}</MenuItem>
                      <MenuItem key={'trainingProgram_Chat-Luong-Cao'} value={'trainingProgram_Chat-Luong-Cao'}>{t("user_profile.high_quality_program")}</MenuItem>
                      <MenuItem key={'trainingProgram_Cu_Nhan_Tai_Nang'} value={'trainingProgram_Cu_Nhan_Tai_Nang'}>{t("user_profile.talented_bachelor_program")}</MenuItem>
                      <MenuItem key={'trainingProgram_Viet-Phap'} value={'trainingProgram_Viet-Phap'}>{t("user_profile.viet_french_program")}</MenuItem>
                      <MenuItem value=" "></MenuItem>
                    </Select>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} offset={0}>
                  <Box sx={{ display: 'block', width: '100%' }}>
                    <FormLabel htmlFor="trainingBatch" sx={{ color: 'inherit', display: 'block', marginBottom: 1, textAlign: 'start' }}>{t("user_profile.education_system")})</FormLabel>
                    <Select
                      id="trainingBatch"
                      name='trainingBatch'
                      value={user?.academicInformation.trainingBatch || ' '}
                      sx={{
                        width: '100%',
                        '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' },
                        color: theme => theme.palette.mode == 'dark' ? '#fff' : '#000', '& .MuiSelect-icon': { color: theme => theme.palette.mode == 'dark' ? '#fff' : '#000' }
                      }}
                      onChange={(e) => setUser((prevUserRecord) => {
                        return {
                          ...prevUserRecord,
                          academicInformation: {
                            ...prevUserRecord.academicInformation,
                            trainingBatch: e.target.value
                          }
                        }
                      })}
                    >
                      <MenuItem value={'trainingBatch_K19'} key={'trainingBatch_K19'}>{t("user_profile.pre_2020_course")}</MenuItem>
                      <MenuItem value={'trainingBatch_K20'} key={'trainingBatch_K20'}>K2020</MenuItem>
                      <MenuItem value={'trainingBatch_K21'} key={'trainingBatch_K21'}>K2021</MenuItem>
                      <MenuItem value={'trainingBatch_K22'} key={'trainingBatch_K22'}>K2022</MenuItem>
                      <MenuItem value={'trainingBatch_K23'} key={'trainingBatch_K23'}>K2023</MenuItem>
                      <MenuItem value={'trainingBatch_K24'} key={'trainingBatch_K24'}>K2024</MenuItem>
                      <MenuItem value={'trainingBatch_K25'} key={'trainingBatch_K25'}>K2025</MenuItem>
                      <MenuItem value=" "></MenuItem>
                    </Select>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }} offset={0}>
                  <FormControl sx={{ gap: 1, display: 'flex', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <FormLabel htmlFor="email" sx={{ color: 'inherit' }}>Email Công Việc</FormLabel>
                    </Box>
                    <TextField
                      inputProps={{ maxLength: 40 }}
                      required
                      id="user_email"
                      name="user_email"
                      value={user?.email + ' ( Default ) '}
                      disabled
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <FormControl sx={{ gap: 1, display: 'flex', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <FormLabel htmlFor="personal_phone" sx={{ color: 'inherit' }}>{t("user_profile.phone_number")}</FormLabel>
                    </Box>
                    <TextField
                      inputProps={{ maxLength: 10 }}
                      id="personal_phone"
                      name="personal_phone"
                      value={user?.generalInformation?.personal_phone}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' },
                      }}
                      onChange={(e) => setUser((prevUserRecord) => {
                        return {
                          ...prevUserRecord,
                          generalInformation: {
                            ...prevUserRecord?.generalInformation,
                            personal_phone: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ display: 'block', width: '100%' }}>
                    <FormLabel htmlFor="selectedMajor" sx={{ color: 'inherit', display: 'block', marginBottom: 1, textAlign: 'start' }}>{t("user_profile.major")}</FormLabel>
                    <Select
                      id="selectedMajor"
                      name='selectedMajor'
                      value={user?.academicInformation.selectedMajor || ' '}
                      sx={{
                        width: '100%',
                        '& fieldset': { borderColor: theme => theme.palette.mode == 'dark' && '#fff !important' },
                        color: theme => theme.palette.mode == 'dark' ? '#fff' : '#000', '& .MuiSelect-icon': { color: theme => theme.palette.mode == 'dark' ? '#fff' : '#000' }
                      }}
                      onChange={(e) => setUser((prevUserRecord) => {
                        return {
                          ...prevUserRecord,
                          academicInformation: {
                            ...prevUserRecord.academicInformation,
                            selectedMajor: e.target.value
                          }
                        }
                      })}
                    >
                      <MenuItem key={'selectedMajor_Cong-nghe-phan-mem'} value={'selectedMajor_Cong-nghe-phan-mem'}>{t("user_profile.software_engineering")}</MenuItem>
                      <MenuItem key={'selectedMajor_He-thong-thong-tin'} value={'selectedMajor_He-thong-thong-tin'}>{t("user_profile.information_systems")}</MenuItem>
                      <MenuItem key={'selectedMajor_Khoa-hoc-may-tinh'} value={'selectedMajor_Khoa-hoc-may-tinh'}>{t("user_profile.computer_science")}</MenuItem>
                      <MenuItem key={'selectedMajor_Thi-giac-may-tinh'} value={'selectedMajor_Thi-giac-may-tinh'}>{t("user_profile.computer_vision")}</MenuItem>
                      <MenuItem key={'selectedMajor_Cong-nghe-tri-thuc'} value={'selectedMajor_Cong-nghe-tri-thuc'}>{t("user_profile.knowledge_technology")}</MenuItem>
                      <MenuItem key={'selectedMajor_Cong-nghe-thong-tin'} value={'selectedMajor_Cong-nghe-thong-tin'}>{t("user_profile.information_technology")}</MenuItem>
                      <MenuItem key={'selectedMajor_Khong-co'} value={'selectedMajor_Khong-co'}>{t("user_profile.no_major_assigned")}</MenuItem>
                      <MenuItem value=" "></MenuItem>
                    </Select>
                  </Box>
                </Grid>

                <Grid size={12}>
                  <FormControl sx={{ gap: 1, display: 'flex', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <FormLabel htmlFor="preferences" sx={{ color: 'inherit' }}>{t("user_profile.topics_of_interest")}</FormLabel>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {interestList.map((data, _index) => {
                        return <>
                          <Chip key={_index * 1425346} label={data.text} onClick={() => chipClick(data.id)}
                            color={(data?.id == 'student_handbook' || interest.includes(data.id)) ? 'info' : ''}
                            sx={{
                              '--mui-palette-action-selected': theme => theme.palette.mode == 'dark' ? 'rgb(255 255 255 / 0%)' : '#fff',
                              border: '1px solid #ccc',
                              color: theme => data?.id == 'student_handbook' || interest.includes(data.id) ? '#ffffff' : theme.palette.text.secondary,
                            }} />
                        </>
                      })}
                    </Box>
                  </FormControl>
                </Grid>

              </Grid>
              <Box >
                <Typography sx={{ width: '100%', textAlign: 'end', marginTop: 2 }}>{t("user_profile.last_updated_at")} : {getDate(user?.updatedAt)}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%', paddingTop: 1 }}>
              <Button variant='contained' color="success" onClick={updateClick}>{t("user_profile.update_info")}</Button>

              <Button
                onClick={() => getModal(t("user_profile.reset_password"), null, null, null, {
                  content: UpdatePasswordModal,
                  props: { token, processHandler, noticeHandler, user }
                })}
                variant='contained' color='error'>{t("user_profile.reset_password")}</Button>
            </Box>

          </>} </Box>

      </Block>
    </Box>
  )
}

export default Profile

function UpdatePasswordModal({ onClose, parent }) {
  const { noticeHandler, processHandler, user, token } = parent
  const [updateUser, setUpdateUser] = useState({})
  const [useError, setError] = useState('')
  const Accesstoken = useSelector(state => state.auth.token)

  const buttonHandle = () => {
    if (!updateUser?.current_password) {
      setError('WRITE_CURRENT_PASSWORD')
      console.error('WRITE_CURRENT_PASSWORD')
      return
    }

    if (!updateUser?.newPassword || updateUser?.newPassword.length < 6) {
      console.error('WRITE_NEW_PASSWORD')
      setError('WRITE_NEW_PASSWORD')
      return
    }

    if (!updateUser?.newPassword_2 || updateUser?.newPassword_2.length < 6) {
      console.error('WRITE_NEW_PASSWORD_AGAIN')
      setError('WRITE_NEW_PASSWORD_AGAIN')
      return
    }

    if (updateUser?.newPassword != updateUser?.newPassword_2) {
      console.error('NEW_PASSWORD_NOT_MATCH')
      setError('NEW_PASSWORD_NOT_MATCH')
      return
    }

    const ResetPasswordEvent = processHandler.add('#ResetPassword')
    useApi.reset_password(Accesstoken, updateUser?.current_password, updateUser?.newPassword)
      .then(() => {
        noticeHandler.add({
          status: 'success',
          message: t("user_profile.password_reset_success")//'Đặt lại mật khẩu thành công !'
        })
        onClose()
      })
      .catch((err) => setError(err))
      .finally(() => processHandler.remove('#ResetPassword', ResetPasswordEvent))
  }

  return (
    <Box component="form"
      sx={{ display: 'flex', flexDirection: 'column', minWidth: { xs: '80vw', md: '50vw', lg: '35vw' }, width: '100%', gap: 2, position: 'relative', color: theme => theme.palette.primary.main }}>
      <FormControl sx={{ gap: 1 }}>
        <FormLabel htmlFor="current_password" sx={{ color: 'inherit' }}>{t("user_profile.current_password")}</FormLabel>
        <TextInput name="current_password" placeholder="••••••" type="password" id="current_password"
          onChange={(e) => {
            setUpdateUser((prev) => {
              return { ...prev, current_password: e.target.value }
            })
          }}

          autoComplete="password" fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
          sx={{
            color: '#000',
            '&:hover fieldset': ['WRITE_CURRENT_PASSWORD', 'WRONG_PASSWORD'].includes(useError) && { borderColor: `red !important` },
            '& fieldset': ['WRITE_CURRENT_PASSWORD', 'WRONG_PASSWORD'].includes(useError) && { borderColor: `red !important`, borderWidth: '1.5px' }
          }} />
        {useError == 'WRITE_CURRENT_PASSWORD' && <Typography variant='h6' sx={{ fontSize: '0.775rem', color: 'red', textAlign: 'end' }}>{t("user_profile.data_required_min_6")}</Typography>}
        {useError == 'WRONG_PASSWORD' && <Typography variant='h6' sx={{ fontSize: '0.775rem', color: 'red', textAlign: 'end' }}>{t("user_profile.invalid_password")}</Typography>}
      </FormControl>
      <FormControl sx={{ gap: 1 }}>
        <FormLabel htmlFor="newPassword" sx={{ color: 'inherit' }}>{t("user_profile.new_password")}</FormLabel>
        <TextInput name="newPassword" placeholder="••••••" type="password" id="newPassword"
          onChange={(e) => {
            setUpdateUser((prev) => {
              return { ...prev, newPassword: e.target.value }
            })
          }}
          fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
          sx={{
            color: '#000',
            '&:hover fieldset': { borderColor: ['WRITE_NEW_PASSWORD', 'NEW_PASSWORD_NOT_MATCH'].includes(useError) && `red !important` },
            '& fieldset': ['WRITE_NEW_PASSWORD', 'NEW_PASSWORD_NOT_MATCH'].includes(useError) && { borderColor: `red !important`, borderWidth: '1.5px' }
          }} />
        {useError == 'WRITE_NEW_PASSWORD' && <Typography variant='h6' sx={{ fontSize: '0.775rem', color: 'red', textAlign: 'end' }}>{t("user_profile.data_required_min_6")}</Typography>}
        {useError == 'NEW_PASSWORD_NOT_MATCH' && <Typography variant='h6' sx={{ fontSize: '0.775rem', color: 'red', textAlign: 'end' }}>{t("user_profile.password_repeat_mismatch")}</Typography>}
      </FormControl>

      <FormControl sx={{ gap: 1 }}>
        <FormLabel htmlFor="newPassword_2" sx={{ color: 'inherit' }}>{t("user_profile.new_password_confirm")}</FormLabel>
        <TextInput name="newPassword_2" placeholder="••••••" type="password" id="newPassword_2"
          onChange={(e) => {
            setUpdateUser((prev) => {
              return { ...prev, newPassword_2: e.target.value }
            })
          }}
          fullWidth variant="outlined" inputProps={{ maxLength: 40 }}
          sx={{
            color: '#000',
            '&:hover fieldset': { borderColor: ['WRITE_NEW_PASSWORD_AGAIN', 'NEW_PASSWORD_NOT_MATCH'].includes(useError) && `red !important` },
            '& fieldset': ['WRITE_NEW_PASSWORD_AGAIN', 'NEW_PASSWORD_NOT_MATCH'].includes(useError) && { borderColor: `red !important`, borderWidth: '1.5px' }
          }} />

        {useError == 'WRITE_NEW_PASSWORD_AGAIN' && <Typography variant='h6' sx={{ fontSize: '0.775rem', color: 'red', textAlign: 'end' }}>{t("user_profile.data_required_min_6")}</Typography>}
        {useError == 'NEW_PASSWORD_NOT_MATCH' && <Typography variant='h6' sx={{ fontSize: '0.775rem', color: 'red', textAlign: 'end' }}>{t("user_profile.password_repeat_mismatch")}</Typography>}

      </FormControl>

      <Button variant='contained' color='info' onClick={buttonHandle}>{t("user_profile.student_handbook")}Cập Nhật</Button>
    </Box>
  )
}

const TextInput = styled(TextField)(({ theme }) => ({
  '& input': { color: '#000' }, WebkitTextFillColor: '#000',
  '&:hover fieldset': { borderColor: `${theme.palette.primary.main} !important` }
}));