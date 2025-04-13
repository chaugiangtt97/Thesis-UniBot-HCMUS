import { Avatar, Box, CircularProgress, LinearProgress, Typography } from '@mui/material'
import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import { motion } from "framer-motion"
import { ChatDisplay_Style, ChatMessage } from './ChatDisplay';
import { BubbleLeft } from '../MessageEffect/BubbleLeft';
import botAvatar from '~/assets/botAvatar.png'
function ProcessBlock({messageHandler, sx = {}}) {
  return (
    messageHandler.isProcess && <>

      <Box sx = {{ ...ChatDisplay_Style, justifyContent: 'start' }}>
        <ChatMessage sx = {{   
            marginLeft: {md: '20px', xs: 0},
            background: 'linear-gradient(319deg, rgb(255 255 255) 0%, rgb(186 173 255) 100%)',
            color: '#000'
          }}>
            <>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Typography variant='p' sx = {{  fontSize: '0.825rem', color: '#000' }}>Đang tìm kiếm</Typography>
              </Box>

              <LinearProgress color="grey" sx = {{
                height: '2px',
                borderRadius: '10px',
                marginBottom: '5px',
                marginTop: '2px'
              }}/>

              {Array.isArray(messageHandler.notification) && messageHandler.notification.map((text, index) => (
                <motion.div
                  key={index}
                    initial={{ transform: "scale(0)" }}
                    animate={{ transform: "scale(1)" }}
                    transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                  }}>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    {  !text.state ? 
                      <CircularProgress size="10px" sx = {{ marginRight: '8px' }}/>
                      : <CheckIcon sx = {{fontSize:"14px", marginRight: '4px', color: '#09d953' }} />}

                    <Typography variant='p' sx = {{  fontSize: '0.725rem', color: '#000' }}>
                      {text.notice} 
                      {'  '}
                      {'  '}
                      { text.duration ? text.duration/1000 + 's' : '' }
                    </Typography>
                  </Box>
                </motion.div>
                ))}
            </>
          <BubbleLeft/>
        </ChatMessage>
        <Avatar sx = {{ display: { xs: 'none', md: 'block' } }} alt="ChatBot" src={botAvatar} />
      </Box>
    </>
  )
}

export default ProcessBlock