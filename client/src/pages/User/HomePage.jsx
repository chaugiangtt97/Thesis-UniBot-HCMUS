import { Box, Button, Typography, useColorScheme } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { navigate as sidebarAction } from '~/store/actions/navigateActions';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import avatar from '~/assets/10665849.png'

export function HomePage() {
  const { mainLayout } = useOutletContext();
  
  const navigate = useNavigate()
  const isLogin = useSelector((state) => state.auth.user ? state.auth.loggedIn : null);

  useEffect(() => {
    document.title = 'Chatbot - Trang Chủ';
    mainLayout.navigate(120)

  })
  const Start = (e) => {
    isLogin ? navigate('/chat') : navigate('/signin')
  }
  
  return (
    <Box 
      sx = {{ 
      width: '100%',
      height: '100%',
      minHeight: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      paddingBottom: { xs: '24px', md: '30px' }
    }}>
      <Box sx = {{  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 1, md: 2 }, maxWidth: '460px' }}>
        <Box sx = {{  width:  '295px', height:  '200px' }}> <img alt='Chatbot' src={avatar} style = {{ width: '100%', height: '100%' }} /> </Box>
        
        <Typography variant='h2' sx = {{ 
          fontSize: { xs: '1.825rem', md: '2.025rem' },
          fontWeight: '900',
          fontFamily: '"Arial",sans-serif',
          background: theme => theme.palette.mode == 'dark' ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
                : 'linear-gradient(90deg, #463aa2 4%, color-mix(in oklch, #382e82, #0061cf) 22%, #047aff 45%, color-mix(in oklch, #047aff, #c148ac) 67%, #c148ac 100.2%)',
          color: 'transparent',
          backgroundSize: '100% 100%',
          WebkitBackgroundClip : 'text'
         }}>
            <TypeAnimation
              sequence={[
                'Xin chào, Tôi',
                'Xin',
                'Xin chào, Mình là UniBot!',
              ]}
              speed={40}
              cursor={true}
            />
         
         </Typography>

        <Typography variant='p' sx = {{ 
          color: theme => theme.palette.text.secondary,
          textAlign: 'center',
          fontSize: '1rem',
          maxWidth: '98%'
        }}>
          Trợ lý ảo giúp bạn giải đáp thắc mắc, tra cứu thông tin một cách nhanh chóng và chính xác nhất !
        </Typography>

        <Button variant='contained' sx = {{ 
          background: theme => theme.palette.primary.main,
          '&:hover' : {
            boxShadow: 'var(--mui-shadows-4)'
          }
        }} onClick={Start}>Bắt đầu Ngay</Button>
      </Box>
    </Box>
  )
}

export default HomePage