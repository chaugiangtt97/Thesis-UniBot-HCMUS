import { Avatar, Box } from '@mui/material'
import React from 'react'

function AvatarUserDefault({sx , s_width, s_height, user_profile  }) {
  return (
    <Box sx ={{ ...sx ,width: s_width ? s_width : '50px', height: s_height ? s_height : '50px',  borderRadius: '50%', marginRight: 1 }}>
      <Avatar sx = {{ background: '#eaeff1', width: '100%', height: '100%', display: { xs: 'none', md: 'flex', width: '100%', height: '100%' } }} 
        src={`/studentAvatar_${user_profile?.generalInformation?.sex}.png`}
      />
    </Box>
  )
}

export default AvatarUserDefault