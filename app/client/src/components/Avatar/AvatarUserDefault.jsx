import { Avatar, Box } from '@mui/material'
import React from 'react'
import botAvatar from '~/assets/botAvatar.png'
function AvatarUserDefault() {
  return (
    <Box sx = {{ 
      padding: '2px',
      background: '#ffffff1a',
      borderRadius: '50%',
      marginRight: 2,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)',
     }}>
      <Avatar alt="Remy Sharp" src={botAvatar} />
    </Box>
  )
}

export default AvatarUserDefault