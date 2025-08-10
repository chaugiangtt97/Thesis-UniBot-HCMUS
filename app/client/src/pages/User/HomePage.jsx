import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import avatar from '~/assets/10665849.png';
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { mainLayout } = useOutletContext();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.auth.user ? state.auth.loggedIn : null);
  const user = useSelector((state) => state.auth.user);

  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Chatbot - Trang Chủ';
    mainLayout.navigate(120);

    // isLogin && navigate('/chat');
    if (isLogin) {
      if (user?.role === 'administrator') {
        navigate('/chat_generator');
      } else if (user?.role === 'student') {
        navigate('/chat');
      }
    }

    return () => {
      mainLayout.navigate(0);
    };
  }, [mainLayout]);

  const handleStart = () => {
    navigate(isLogin ? '/chat' : '/signin');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexDirection: 'column',
        paddingBottom: { xs: '24px', md: '30px' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          maxWidth: { xs: '95vw', md: '520px', xl: '580rem' },
        }}
      >
        <Box sx={{ width: { xs: '295px', xl: '445px' }, height: { xs: '200px', xl: '285px' } }}>
          <img alt="Chatbot" src={avatar} style={{ width: '100%', height: '100%' }} />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.825rem', md: '2.025rem', xl: '2.825rem' },
            fontWeight: '900',
            fontFamily: '"Arial", sans-serif',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
                : 'linear-gradient(90deg, #463aa2 4%, color-mix(in oklch, #382e82, #0061cf) 22%, #047aff 45%, color-mix(in oklch, #047aff, #c148ac) 67%, #c148ac 100.2%)',
            color: 'transparent',
            backgroundSize: '100% 100%',
            WebkitBackgroundClip: 'text',
          }}
        >
          {/* <TypeAnimation
            sequence={[t("homepage.greeting_with_name", { name: "Unibot" })]}
            speed={40}
            cursor
          /> */}
          {t("homepage.greeting_with_name", { name: "Unibot" })}
        </Typography>

        <Typography
          sx={{
            color: (theme) => theme.palette.text.secondary,
            textAlign: 'center',
            fontSize: { xs: '1rem', xl: '1.425rem' },
            maxWidth: { xs: '480px', xl: '670px' },
            paddingBottom: { xs: 0.5, xl: 1 }
          }}
        >
          {/* Trợ lý ảo giúp bạn giải đáp thắc mắc, thông tin một cách nhanh chóng và chính xác nhất. Bạn cần đăng nhập để sử dụng! */}
          {t('homepage.assistant_description')} {t('homepage.login_prompt')}
        </Typography>

        <Button
          variant="contained"
          sx={{
            background: (theme) => theme.palette.primary.main,
            fontSize: { xl: '1.425rem' },
            borderRadius: { xl: '10px' },
            padding: { xl: '10px 28px' }
          }}
          onClick={handleStart}
        >
          {t('homepage.login_now')}
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;