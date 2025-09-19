import { Box, Typography, ListItemText, ListItemButton, useColorScheme, Button, Tooltip, IconButton, ListItemIcon, List, CardContent, Avatar, Card, ListItem, Divider } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react'
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AvatarUserDefault from '~/components/Avatar/AvatarUserDefault';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from '~/components/LanguageSwitcher';

const MuiListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: '12px',
  [theme.breakpoints.up('xl')]: {
    borderRadius: '14px',
    minHeight: '50px',
  },
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  transition: 'none',
  minHeight: '40px',
  textAlign: 'center',
  background: 'transparent !important',

  '& > div': {
    color: theme.palette.mode == 'dark' ? '#fff' : '#394e6a',
    transition: 'none',
    minWidth: '65px',
    fontSize: '0.675rem',
    fontWeight: '500',
    [theme.breakpoints.up('md')]: {
      fontSize: '0.875rem',
      minWidth: '80px',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '1.275rem',
      minWidth: '120px',
    },
  },

  '&:hover': {
    background: '#cccccc63 !important',
  },

  '&.Mui-selected': {
    border: '1px solid #047aff',
    transition: 'none',
    '& > div': {
      color: '#047aff',
    }
  },

  '&.Mui-selected:hover': {
    background: '#047aff !important',
    color: '#fff',
    '& > div': {
      color: '#fff !important',
    }
  }

}))

const MuiListSubItemButton = styled(MuiListItemButton)(({ theme }) => ({
  '& > div': {
    color: '#fff'
  },

  '&:hover': {
    background: '#ffffff14 !important',
  },

  '&.Mui-selected': {
    background: '#047aff !important',
    '& > div': {
      '& > span': {
        color: '#fff',
      }
    }
  }
}))

const SubSidebarContainer = styled(Box)(({ theme }) => ({
  position: 'absolute', top: 0, right: 0, height: '100vh', maxHeight: '100vh', overflow: 'auto',
  width: 'fit-content', minWidth: '240px', padding: theme.spacing(2), transform: 'scale(1)', transition: '0.5s all ease',
  left: '-100%',
  borderRadius: '0 15px 15px 0', zIndex: 10,
  background: theme.palette.primary.main
}))

const Backdrop = styled(Box)(() => ({
  top: 0, background: '#0000008c', height: '100vh', width: '100%', right: 0,
  position: 'absolute', transform: 'scale(1)', transition: '0.5s all ease', zIndex: 9, display: 'none'
}))

const MuiDivider = styled(Box)(({ theme }) => ({
  background: '#ffffff63', height: '1px', width: '100%', marginTop: theme.spacing(1.5), marginBottom: theme.spacing(1.5),
}))

const InformationCard = styled(Card)(({ theme }) => ({
  ...theme.typography.body2, height: 'fit-content', width: '100%', minHeight: '40px',
  padding: theme.spacing(1), borderRadius: '10px'
}))


function MainLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { t, i18n } = useTranslation();

  const navigateList = [
    { id: 120, text: "navigation_label.home", link: "/", require: false },
    { id: 121, text: "navigation_label.conservation", link: "/chat", admin: '/chat_generator', require: true },
    { id: 122, text: "navigation_label.fags", link: "/faqs", require: false },
    { id: 123, text: "navigation_label.feedback", link: "/feedback", require: true }
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

  const [menu, setMenu] = useState(null)
  const [isOpenMenu, setOpenMenu] = useState(false)

  const marqueeRef = useRef(null);
  const textRef = useRef(null);

  const [openNavigateList, setOpenNavigateList] = useState(false);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMenuClick =
        event.target.closest('.menu-container') || event.target.closest('.menu-button');

      if (!isMenuClick) {
        setOpenNavigateList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleListItemClick = (_event, index, address, admin_address, require) => {
    setIsOpenSideBar(false)
    setOpenMenu(false)
    if (require && !user_profile) {
      noticeHandler.add({
        status: 'warning',
        message: 'Vui Lòng Đăng Nhập'
      })
      return
    }

    if (admin_address && ['administrator', 'academic_administration'].includes(user_profile.role)) {
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

  const confText = 'system_notice_testing' //'Hệ thống đang trong giai đoạn thử nghiệm, mọi thông tin chính thức vui lòng liên hệ UNIBOT2025@gmail.com'

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '2560px',
      height: '100dvh',
      background: theme => theme.palette.mode == 'dark' ? '#25294a' : '#DDF3FC',
      paddingTop: { xs: '72px', md: '72px', xl: '98px' },
      position: 'absolute',
      overflow: 'hidden'
    }}>

      <Backdrop onClick={() => setIsOpenSideBar(prev => !prev)}
        sx={(theme) => ({ [theme.breakpoints.down('lg')]: { display: isOpenSideBar && 'block !important' } })} />

      <SubSidebarContainer className='subNavigate' sx={(theme) => ({
        [theme.breakpoints.down('lg')]: { left: isOpenSideBar && '0 !important' }
      })}>

        <Box>
          <Typography variant='h1' sx={{
            fontSize: '1.6rem',
            fontWeight: '900',
            fontFamily: '"Arial",sans-serif, "Roboto"',
            width: '100%', textAlign: 'center',
            background: theme => theme.palette.mode == 'dark' ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
              : 'linear-gradient(90deg, #f8f7ff 4%, color-mix(in oklch, #dcd7ff, #bbdbff) 22%, #add4ff 45%, color-mix(in oklch, #b2d6ff, #ffffff) 67%, #c148ac 100.2%)',
            color: 'transparent',
            backgroundSize: '100% 100%',
            WebkitBackgroundClip: 'text'
          }}>
            UNIBOT
          </Typography>
        </Box>

        <MuiDivider />

        {navigateList.map((data, _index) => {
          return data?.text ? (
            <MuiListSubItemButton key={data.id} selected={selectedIndex === data.id}
              onClick={(event) => handleListItemClick(event, data.id, data.link, data?.admin, data?.require)} >
              <ListItemText primary={t(data.text)} />
            </MuiListSubItemButton>
          ) : <></>
        })}

        <MuiDivider />

        {!isLogin ? <ListItemButton onClick={() => navigate('/signin')}
          sx={{
            background: '#ffffffe8', borderRadius: '8px', marginTop: 1,
            '& > div': { color: '#000', fontSize: '2rem' }, '&:hover': { background: '#fff', fontWeight: 700, }, '&:active': { transform: 'scale(0.9)' }
          }} >
          <ListItemIcon> <LoginOutlinedIcon /> </ListItemIcon>
          <ListItemText primary="Đăng Nhập" />
        </ListItemButton> : <>
          <InformationCard
            sx={{ background: theme => theme.palette.mode == 'light' ? '#b1cee1' : 'rgb(46, 63, 108)' }}>

            <Box onClick={() => navigate('/user_profile')}
              sx={{ display: 'flex', mb: 1, mt: 1, '&:active': { transform: 'scale(0.9)' } }} >
              <Avatar src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
                sx={{ width: 32, height: 32, bgcolor: deepOrange[500], color: '#fff' }}></Avatar>
              <CardContent sx={{ height: '100%', py: 0, '&:last-child': { py: 0 }, position: 'relation', paddingLeft: 1 }}>
                <Typography component="div" variant="p"
                  sx={{
                    width: '108px', overflow: 'hidden', fontSize: '0.725rem', color: theme => theme.palette.mode == 'light' ? '#000' : '#fff',
                    whiteSpace: 'nowrap', textOverflow: 'ellipsis', cursor: 'pointer', fontWeight: '800'
                  }} >
                  {user_profile?.name ? user_profile.name : 'Không tồn tại'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.625rem !important', lineHeight: '120%', fontWeight: '400', color: theme => theme.palette.mode == 'light' ? '#505766' : 'rgb(133, 141, 160)',
                    width: '128px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer'
                  }} >
                  {user_profile?.email ? user_profile.email : 'Không tồn tại'}
                </Typography>
              </CardContent>
            </Box>

            <ListItemButton onClick={() => getModal(' ', 'Bạn Thật Sự Muốn Đăng Xuất Sao ☹️', 'Đăng Xuất', logoutClick)}
              sx={{
                background: '#ffffffe8', borderRadius: '8px',
                '& > div': { color: '#000', }, '&:hover': { background: '#fff', fontWeight: 700, }, '&:active': { transform: 'scale(0.9)' }
              }} >
              <ListItemIcon> <ReplyAllIcon /> </ListItemIcon>
              <ListItemText primary="Đăng Xuất" />
            </ListItemButton>
          </InformationCard>
        </>}
      </SubSidebarContainer>

      <Backdrop onClick={() => setOpenMenu(prev => !prev)}
        sx={(theme) => ({ [theme.breakpoints.down('lg')]: { display: isOpenMenu && 'block !important' } })} />

      <Box className='MainMenu' sx={(theme) => ({
        position: 'absolute', top: 0, left: '-400%', height: '100vh', maxHeight: '100vh', overflow: 'auto',
        width: 'fit-content', transform: 'scale(1)', transition: '0.5s all ease', zIndex: 10,
        background: theme.palette.primary.main,
        [theme.breakpoints.down('lg')]: { left: isOpenMenu ? '0' : '-100% !important' }
      })}>
        {menu}
      </Box>

      <Box sx={{
        width: '100%', height: { xs: '72px', md: '72px', xl: '98px' }, color: '#000', background: theme => theme.palette.mode == 'dark' ? '#100a34' : '#fff',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)', position: 'absolute', top: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingX: { xl: 12, lg: 8, md: 6, xs: 3 }, zIndex: 5
      }}>
        <Box>
          <Typography variant='h1' sx={{
            fontSize: { xl: '2rem', md: '1.4rem', xs: '1.3rem' },
            fontWeight: '900',
            background: theme => theme.palette.mode == 'dark' ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
              : 'linear-gradient(90deg, #463aa2 4%, color-mix(in oklch, #382e82, #0061cf) 22%, #047aff 45%, color-mix(in oklch, #047aff, #c148ac) 67%, #c148ac 100.2%)',
            color: 'transparent',
            backgroundSize: '100% 100%',
            WebkitBackgroundClip: 'text'
          }}>
            UNIBOT
          </Typography>
        </Box>

        <Button onClick={() => setIsOpenSideBar(true)} startIcon={<MenuIcon fontSize='large' />} sx={{ display: { xs: 'block', md: 'none' }, color: theme => theme.palette.text.secondary }}></Button>

        <Box className='Navigate' sx={{
          width: 'fit-content',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: { xs: 1.5, xl: 2.5 },
          display: { md: 'flex', xs: 'none' }
        }}>
          {navigateList.map((data, _index) => {
            return data?.text ? (
              <MuiListItemButton
                key={data.id}
                selected={(selectedIndex === data.id)}
                onClick={(event) => handleListItemClick(event, data.id, data.link, data?.admin, data?.require)}
              >
                <ListItemText primary={t(data.text)} />
              </MuiListItemButton>
            ) : <></>
          })}
        </Box>

        <Box sx={{ display: { md: 'flex', xs: 'none' }, alignItems: 'center', gap: 1 }}>
          {
            isLogin ?
              <>
                <Button className="menu-button" sx={{ paddingX: 2, fontSize: { xs: '1rem', xl: '1.575rem' }, fontWeight: 500, color: theme => theme.palette.mode == 'dark' ? '#fff' : '#047aff' }}
                  startIcon={
                    <Box sx={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: 1 }}>
                      <AvatarUserDefault s_width={'38px'} s_height={'38px'} sx={{ display: { xs: 'none', md: 'block' } }} />
                    </Box>}
                  endIcon={<ExpandMoreIcon sx={{ fontWeight: 500, color: theme => theme.palette.mode == 'dark' ? '#fff' : '#047aff' }} />}
                  onClick={() => setOpenNavigateList((prev) => !prev)}
                > {user_profile?.name} </Button>

                {openNavigateList && <Box className="menu-container" sx={{ 'boxShadow': '0 2px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', background: '#fff', zIndex: '1000', width: 'fit-content', maxWidth: 320, position: 'absolute', bottom: '-224px', right: { xl: '68px', xs: '28px' } }}>
                  <nav aria-label="main folders">
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton onClick={(event) => setOpenNavigateList(false) || handleListItemClick(event, '##login', 'user_profile', 'admin_profile', true)}>
                          <ListItemIcon>
                            <AccountCircleOutlinedIcon sx={{ color: '#000' }} />
                          </ListItemIcon>
                          <ListItemText primary={t('user_dropdown.nav_profile_page_edit')} sx={{ fontSize: { xs: '0.875rem', xl: '1.125rem' } }} />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </nav>
                  <Divider sx={{ background: '#000' }} />
                  <nav aria-label="secondary folders">
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => setMode(mode == 'dark' ? 'light' : 'dark')}>
                          <ListItemText primary={mode == 'dark' ? t("theme_mode_label.dark") : t("theme_mode_label.light")} sx={{ fontSize: { xs: '0.875rem', xl: '1.125rem' }, fontWeight: 500, color: theme => theme.palette.mode == 'dark' ? '#100a34' : '#047aff' }} />
                        </ListItemButton>

                        <ListItemIcon>
                          <LightModeIcon sx={{ color: theme => theme.palette.mode == 'dark' ? '#100a34' : '#047aff' }} />
                        </ListItemIcon>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => setIsOpenModel(true)}>
                          <ListItemText primary={t("user_dropdown.logout_button_label")} sx={{ fontSize: { xs: '0.875rem', xl: '1.125rem' }, fontWeight: 500, color: '#ff5d5d' }} />
                        </ListItemButton>
                        <ListItemIcon>
                          <LogoutIcon sx={{ color: '#ff5d5d' }} />
                        </ListItemIcon>
                      </ListItem>
                      <ListItem disablePadding>
                        <LanguageSwitcher />
                      </ListItem>
                    </List>
                  </nav>
                </Box>}

              </> : <>
                <Box sx={{ fontSize: { xl: '1.275rem' }, display: 'flex', justifyContent: 'center', left: { md: '40px', xs: '24px', xl: '92px' }, top: { xl: '118px', md: '96px', xs: '80px' } }}>
                  {mode == 'light' ? <Button onClick={() => setMode('dark')} startIcon={<LightModeIcon sx={{ fontSize: 'inherit' }} />} sx={{ paddingX: { xl: '1rem' }, fontSize: 'inherit', color: '#047aff' }}>{t("theme_mode_label.light")}</Button>
                    : (<Button onClick={() => setMode('light')} startIcon={<DarkModeIcon sx={{ fontSize: 'inherit' }} />} sx={{ paddingX: { xl: '1rem' }, fontSize: 'inherit', color: '#fff' }}>{t("theme_mode_label.dark")}</Button>)
                  }
                </Box>
                <LanguageSwitcher />
              </>
          }

        </Box>

      </Box>

      <Box className="menu" sx={{ overflow: 'auto', height: '100%', paddingY: '2px', paddingBottom: { xs: isFooter && '32px', xl: isFooter && '40px' } }}>
        <Outlet context={{
          ...useOutletContext(), setFooter, menu: {
            setMenu: setMenu, handle: setOpenMenu
          }, mainLayout: { navigate: setSelectedIndex }
        }} />
      </Box>

      {isFooter && <Box sx={{
        width: '100%',
        height: 'fit-content',
        background: theme => theme.palette.mode == 'dark' ? '#100a34' : '#fff',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        paddingY: { xl: 1 }
      }} ref={marqueeRef} >
        {textRef.current?.scrollWidth > marqueeRef.current?.offsetWidth ?
          <marquee behavior="scroll" style={{ width: '100vw' }} direction="left" id="mymarquee" scrollamount="10">
            <Typography ref={textRef} sx={{ fontSize: { xs: '0.875rem', xl: '1.225rem' }, overflow: '', textOverflow: 'ellipsis', textWrap: 'nowrap', paddingX: '9px', color: theme => theme.palette.mode == 'dark' ? '#ffffff85' : '#33333385', width: '100%', textAlign: 'center', lineHeight: '30px' }}>
              {t('system_notice_testing')}
            </Typography>
          </marquee> :
          <Typography ref={textRef} sx={{ fontSize: { xs: '0.875rem', xl: '1.225rem' }, overflow: '', textOverflow: 'ellipsis', textWrap: 'nowrap', paddingX: '9px', color: theme => theme.palette.mode == 'dark' ? '#ffffff85' : '#33333385', width: '100%', textAlign: 'center', lineHeight: '30px' }}>
            {t('system_notice_testing')}
          </Typography>
        }

      </Box>}


      <NotifycationModal modalHandler={{
        state: isOpenModel,
        close: () => setIsOpenModel(false),
        action: logoutClick,
        actionName: 'logout'
      }} title={' '} content={'Are you sure you want to log out? ☹️'} />

    </Box>
  )
}

export default MainLayout


let countries = [
  {
    code: "fr",
    name: "Français",
    country_code: "fr",
  },
  // {
  //   code: "vn",
  //   name: "Viet Nam",
  //   country_code: "vn",
  // },
  {
    code: "en",
    name: "English",
    country_code: "gb",
  },
];
