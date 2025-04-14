import styled from '@emotion/styled';
import { Box, Stack } from '@mui/material';
import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

const AuthContainer = styled(Stack)(({ theme }) => ({
    padding: 20,
    height: '100vh',
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.mode == 'dark' ? '#25294a' : '#DDF3FC',
}));

const AuthLayout = () => {
  return (
    <AuthContainer  direction="column" justifyContent="space-between">
        <Outlet context={useOutletContext()}/>
    </AuthContainer>
  );
};

export default AuthLayout

