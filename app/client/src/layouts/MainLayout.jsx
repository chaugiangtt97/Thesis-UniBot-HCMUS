import { Box, Typography, ListItemText, ListItemButton, useColorScheme, Button, Tooltip, IconButton, ListItemIcon, List, CardContent, Avatar, Card } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import styled from '@emotion/styled'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '~/store/actions/authActions';
import LoginIcon from '@mui/icons-material/Login';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsSystemDaydreamIcon from '@mui/icons-material/SettingsSystemDaydream';
import NotifycationModal from '~/components/Mui/NotifycationModal';
import MenuIcon from '@mui/icons-material/Menu';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { deepOrange } from '@mui/material/colors';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';


const MuiListItemButton = styled(ListItemButton) (({theme}) => ({
  borderRadius: '12px',
  marginBottom:  theme.spacing(0.5),
  marginTop:  theme.spacing(0.5),
  transition: 'none', 
  minHeight: '40px',
  textAlign: 'center',
  background: 'transparent !important',
  '& > div' : {
    color: theme.palette.mode == 'dark' ? '#fff': '#394e6a',
    transition: 'none', 
    minWidth: '45px',
    '& > span' : {
      fontWeight: 500,
      fontSize: '0.825rem !important'
    },
  },

  '&:hover' : {
    background: '#cccccc63 !important',
    '& > span' : {
      fontSize: '0.825rem !important'
    },
  },

  '&.Mui-selected' : {
    border: '1px solid #047aff',
    transition: 'none', 
    '& > div' : {
      '& > span' : {
        color: '#047aff',
      }
    }
  },

  '&.Mui-selected:hover' : {
    background: '#047aff !important',
    color: '#fff',
    '& > div' : {
      '& > span' : {
        color: '#fff !important',
      }
    }
  }

}))

const MuiListSubItemButton = styled(MuiListItemButton) (({theme}) => ({
  '& > div' : {
    color: '#fff'
  },

  '&:hover' : {
    background: '#ffffff14 !important',
  },

  '&.Mui-selected' : {
    background: '#047aff !important',
    '& > div' : {
      '& > span' : {
        color: '#fff',
      }
    }
  }
}))

const SubSidebarContainer = styled(Box)(({theme}) => ({
  position: 'absolute', top: 0, right: 0, height: '100vh', maxHeight: '100vh', overflow: 'auto', 
  width: 'fit-content', minWidth: '240px', padding: theme.spacing(2), transform: 'scale(1)', transition: '0.5s all ease', 
  left: '-100%',
  borderRadius: '0 15px 15px 0', zIndex: 10,
  background:  theme.palette.primary.main
}))

const Backdrop = styled(Box) (() => ({
  top: 0, background: '#0000008c', height: '100vh', width: '100%', right: 0,
  position: 'absolute', transform: 'scale(1)', transition: '0.5s all ease',  zIndex: 9, display: 'none'
}))

const MuiDivider = styled(Box)  (({theme}) => ({
  background: '#ffffff63', height: '1px', width: '100%', marginTop: theme.spacing(1.5), marginBottom: theme.spacing(1.5), 
}))

const InformationCard = styled(Card) (({theme}) => ({
  ...theme.typography.body2, height: 'fit-content', width: '100%', minHeight: '40px', 
  padding: theme.spacing(1), borderRadius: '10px' }))


function MainLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const navigateList = [
    {id: 120, text: "Trang chủ", link: "/", require: false},
    {id: 121, text: "Trò Chuyện", link: "/chat", admin: '/chat_generator', require: true},
    {id: 122, text: "FAQs", link: "/faqs", require: false},
    {id: 123, text: "Báo lỗi/Góp ý", link: "/feedback", require: true}
  ]

  const [selectedIndex, setSelectedIndex] = useState(null)

  const user_profile = useSelector((state) => state.auth.user ? state.auth.user : null);
  const isLogin = useSelector((state) => state.auth.user ? state.auth.loggedIn : null);
  const { mode, setMode } = useColorScheme();
  const [isOpenModel, setIsOpenModel] = useState(false)
  const { noticeHandler } = useOutletContext();

  const [isFooter, setFooter] = useState(true)
  const [isOpenSideBar, setIsOpenSideBar] = useState(false)
  const { getModal } = useOutletContext();

  const [menu, setMenu ] = useState(null)
  const [isOpenMenu, setOpenMenu ] = useState(false)
  
  // useEffect(() => {
  //   setSelectedIndex(selectedIndexInitial)
  // }, [selectedIndexInitial])


  const handleListItemClick = (_event, index, address, admin_address, require) => {
    setIsOpenSideBar(false)
    setOpenMenu(false)
    if( require && !user_profile ) {
      noticeHandler.add({
        status: 'warning',
        message: 'Vui Lòng Đăng Nhập'
      })
      return 
    }

    if(admin_address && ['administrator', 'academic_administration'].includes(user_profile.role)) {
      navigate(admin_address)
      return
    }
    setFooter(true)
    setSelectedIndex(index)
    navigate(address)
  }

  const logoutClick = (e) => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <Box sx = {{ 
      width: '100%',
      height: '100dvh',
      background: theme => theme.palette.mode == 'dark' ? '#25294a' : '#DDF3FC',
      paddingTop: '72px',
      position: 'absolute',
      overflow: 'hidden'
     }}>

        <Backdrop onClick={() => setIsOpenSideBar(prev => !prev)}
            sx = {(theme) =>({ [theme.breakpoints.down('lg')]: { display: isOpenSideBar && 'block !important' } })} />
        
        <SubSidebarContainer className = 'subNavigate' sx = {(theme) => ({
          [theme.breakpoints.down('lg')]: { left: isOpenSideBar && '0 !important' } })}>

          <Box>
            <Typography variant = 'h1' sx = {{ 
              fontSize: '1.6rem',
              fontWeight: '900',
              fontFamily: '"Arial",sans-serif, "Roboto"',
              width: '100%', textAlign: 'center',
              background: theme => theme.palette.mode == 'dark' ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
                : 'linear-gradient(90deg, #f8f7ff 4%, color-mix(in oklch, #dcd7ff, #bbdbff) 22%, #add4ff 45%, color-mix(in oklch, #b2d6ff, #ffffff) 67%, #c148ac 100.2%)',
              color: 'transparent',
              backgroundSize: '100% 100%',
              WebkitBackgroundClip : 'text'
             }}>
              FIT@HCMUS
            </Typography>
          </Box>

          <MuiDivider/>

          {navigateList.map((data, _index) => {
            return data?.text ? (
              <MuiListSubItemButton key = {data.id} selected={selectedIndex === data.id}
              onClick={(event) => handleListItemClick(event, data.id, data.link, data?.admin, data?.require)} >
                <ListItemText primary= {data.text}/>
              </MuiListSubItemButton>
            ) : <></> })}

          <MuiDivider/>

          { !isLogin ? <ListItemButton onClick={() => navigate('/signin')}
            sx = {{ background: '#ffffffe8', borderRadius: '8px', marginTop: 1,
              '& > div' : { color: '#000', }, '&:hover' : { background: '#fff', fontWeight: 700,    }, '&:active' : { transform: 'scale(0.9)' } }} >
            <ListItemIcon> <LoginOutlinedIcon/> </ListItemIcon>
            <ListItemText primary= "Đăng Nhập" />
          </ListItemButton> : <>
          <InformationCard 
            sx = {{ background: theme => theme.palette.mode == 'light' ? '#b1cee1' : 'rgb(46, 63, 108)' }}>

            <Box onClick= {() => navigate('/user_profile')}
              sx = {{ display: 'flex', mb: 1, mt: 1, '&:active': { transform: 'scale(0.9)' }}} >
              <Avatar src = "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
                sx={{ width: 32, height: 32, bgcolor: deepOrange[500], color: '#fff' }}></Avatar>
              <CardContent sx={{ height: '100%', py: 0, '&:last-child' : {py: 0}, position: 'relation', paddingLeft: 1}}>
                <Typography component="div" variant="p"
                  sx = {{ width: '108px', overflow: 'hidden', fontSize:'0.725rem', color :theme => theme.palette.mode == 'light' ? '#000' : '#fff',
                    whiteSpace: 'nowrap', textOverflow: 'ellipsis', cursor:'pointer', fontWeight: '800' }} >
                  {user_profile?.name ? user_profile.name : 'Không tồn tại'}
                </Typography>
                <Typography
                  sx={{ fontSize: '0.625rem !important', lineHeight: '120%', fontWeight: '400', color: theme => theme.palette.mode == 'light' ? '#505766' : 'rgb(133, 141, 160)',
                    width: '128px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor:'pointer' }} >
                  {user_profile?.email ? user_profile.email : 'Không tồn tại'}
                </Typography>
              </CardContent>
            </Box>

            <ListItemButton onClick={() => getModal(' ', 'Bạn Thật Sự Muốn Đăng Xuất Sao ☹️', 'Đăng Xuất', logoutClick)}
              sx = {{ background: '#ffffffe8', borderRadius: '8px', 
                '& > div' : { color: '#000', }, '&:hover' : { background: '#fff', fontWeight: 700,    }, '&:active' : { transform: 'scale(0.9)' } }} >
              <ListItemIcon> <ReplyAllIcon/> </ListItemIcon>
              <ListItemText primary= "Đăng Xuất" />
            </ListItemButton>
          </InformationCard>
          </>}
        </SubSidebarContainer>

        <Backdrop onClick={() => setOpenMenu(prev => !prev)}
            sx = {(theme) =>({ [theme.breakpoints.down('lg')]: { display: isOpenMenu && 'block !important' } })} />
        
        <Box className = 'subNavigate' sx = {(theme) => ({
          position: 'absolute', top: 0, left: '-100%' , height: '100vh', maxHeight: '100vh', overflow: 'auto', 
          width: 'fit-content', transform: 'scale(1)', transition: '0.5s all ease', zIndex: 10,
          background:  theme.palette.primary.main,
          [theme.breakpoints.down('lg')]: { left: isOpenMenu ? '0' : '-100% !important' }   })}>
          {menu}
        </Box>

        <Box sx = {{ 
          width: '100%', height: '72px', color: '#000', background:  theme => theme.palette.mode == 'dark' ? '#100a34': '#fff',
          boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)', position: 'absolute', top: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingX: { md: 6, xs: 3 }, zIndex : 5
        }}> 
          <Box>
            <Typography variant = 'h1' sx = {{ 
              fontSize: { md: '1.4rem', xs: '1.3rem' },
              fontWeight: '900',
              background: theme => theme.palette.mode == 'dark' ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
                : 'linear-gradient(90deg, #463aa2 4%, color-mix(in oklch, #382e82, #0061cf) 22%, #047aff 45%, color-mix(in oklch, #047aff, #c148ac) 67%, #c148ac 100.2%)',
              color: 'transparent',
              backgroundSize: '100% 100%',
              WebkitBackgroundClip : 'text'
             }}>
              FIT@HCMUS
            </Typography>
          </Box>

          <Button onClick={() => setIsOpenSideBar(true)} startIcon= {<MenuIcon fontSize='large'/>} sx= {{ display: { xs: 'block', md: 'none' }, color: theme => theme.palette.text.secondary }}></Button>
          
          <Box className = 'Navigate' sx = {{ 
              width: 'fit-content',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              gap: 1.5,
              display: { md: 'flex', xs: 'none' }
           }}>
            {navigateList.map((data, _index) => {
              return data?.text ? (
                <MuiListItemButton
                  key = {data.id}
                  selected={(selectedIndex === data.id)}
                  onClick={(event) => handleListItemClick(event, data.id, data.link, data?.admin, data?.require)}
                >
                  <ListItemText primary= {data.text}/>
                </MuiListItemButton>
              ) : <></>
            })}
          </Box>

          <Box sx = {{  display: { md: 'flex', xs: 'none' }, alignItems: 'center', gap: 1 }}>
            {
              isLogin ?
              <>
                <Button sx = {{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#ff5d5d',
                  cursor: 'pointer'
                }} 
                  onClick={() => setIsOpenModel(true)}>
                  <LogoutIcon/>
                  <Typography variant='p'> Đăng Xuất</Typography>
                </Button>

                <Button sx = {{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme => theme.palette.mode == 'dark' ? '#fff' : '#047aff',
                  cursor: 'pointer'
                }} 
                onClick={(event) => handleListItemClick(event, '##login', 'user_profile','admin_profile', true)} >
                  <AccountCircleOutlinedIcon/>
                  <Typography variant='p'>{user_profile?.name}</Typography>
                </Button>
              </> : <>
                <Button sx = {{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme => theme.palette.mode == 'dark' ? '#fff' : '#047aff',
                  cursor: 'pointer'
                }} onClick={() => navigate('/signin')}>
                  <LoginIcon/>
                  <Typography variant='p'>Đăng Nhập</Typography>
                </Button>
              </>
            }
          </Box>
        </Box>

        <Box sx = {{ overflow: 'auto', height: '100%', paddingY: '2px', paddingBottom: isFooter && '32px' }}>
          <Outlet  context={{...useOutletContext(), setFooter, menu: {
            setMenu: setMenu, handle: setOpenMenu
          }, mainLayout: { navigate: setSelectedIndex } }}/>
        </Box>

        <Box sx = {{ display: 'flex', justifyContent: 'center', position: 'absolute', left: { md: '40px', xs: '24px' }, top: { md: '96px', xs: '80px' } }}>
          { mode == 'light' ? <Button onClick={() => setMode('dark')} startIcon = {<LightModeIcon/>} sx = {{ color: '#047aff' }}>Sáng</Button>
          : ( mode == 'dark' ? <Button onClick={() => setMode('system')} startIcon = {<DarkModeIcon/>} sx = {{ color: '#fff' }}>Tối</Button>
          :<Button onClick={() => setMode('light')} startIcon = {<SettingsSystemDaydreamIcon/>} sx = {{ color: theme => theme.palette.mode == 'dark' ? '#fff' : '#047aff' }}>Hệ thống</Button> )
          }
        </Box>

        { isFooter && <Box sx = {{ 
          width: '100%',
          height: 'fit-content',
          background: theme => theme.palette.mode == 'dark' ? '#100a34': '#fff',
          boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
          position: 'absolute',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center'
        }}> 
        <marquee behavior="scroll" style= {{ width: '100vw' }} direction="left" id="mymarquee" scrollamount="10">
        {/* <p>This the the sample</p>
        <p>of my text</p> */}
        <Typography sx = {{ overflow: '', textOverflow: 'ellipsis', textWrap: 'nowrap', paddingX: '9px', color: theme => theme.palette.mode == 'dark' ? '#ffffff85': '#33333385', width: '100%', textAlign: 'center', lineHeight: '30px' }}>
          ĐH Khoa Học Tự Nhiên, Luận văn 2024 @ Mạch Vĩ Kiệt, Nguyễn Duy Đăng Khoa - Xây Dựng Hệ Thống Tra Cứu Dữ Liệu Nội Bộ</Typography>
        </marquee>
        </Box> }


      <NotifycationModal modalHandler = {{
        state: isOpenModel,
        close: () => setIsOpenModel(false),
        action: logoutClick,
        actionName: 'Đăng Xuất'
      }} title={' '} content={'Bạn Thật Sự Muốn Đăng Xuất Sao ☹️'}/>

    </Box>
  )
}

export default MainLayout