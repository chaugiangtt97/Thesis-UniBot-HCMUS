import { Avatar, Box } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SUBDIR } from '~/config/environment'
function AvatarUserDefault({sx , s_width, s_height  }) {
  const user = useSelector((state) => state.auth.user)

  return (
    <Box sx ={{ ...sx ,width: s_width ? s_width : '45px', height: s_height ? s_height : '45px',  borderRadius: '50%', marginRight: 1 }}>
      <Avatar sx = {{ background: '#eaeff1', width: '100%', height: '100%', display: { xs: 'none', md: 'flex', width: '100%', height: '100%' } }} 
        src={`/${SUBDIR}/studentAvatar_${user?.generalInformation?.sex}.png`}
      />
    </Box>
  )
}

export default AvatarUserDefault