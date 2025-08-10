import { Box } from '@mui/material'
import React from 'react'

function ChatBlock({ children, sx = {} }) {
  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      position: 'relative',
      maxHeight: 'calc(100vh - 225px)',
      overflow: 'auto',
      ...sx
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        paddingX: { xl: '2rem', md: '1rem', xs: '10px' }
      }}>
        {children}
      </Box>
    </Box>
  )
}

export default ChatBlock
