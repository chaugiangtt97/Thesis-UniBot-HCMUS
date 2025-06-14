import React, { useEffect } from 'react'
import { motion } from "framer-motion"
import ReactMarkdown from 'react-markdown';
import { BubbleLeft } from '../MessageEffect/BubbleLeft';
import { ChatMessage, ChatDisplay_Style } from './ChatDisplay';
import { Avatar, Box } from '@mui/material';
import botAvatar from '~/assets/botAvatar.png'

function UserTypingMessageBlock({ messageHandler }) {
  useEffect(() => {
  }, [messageHandler?.stream_message])
  return (messageHandler?.stream_state &&
    <motion.div
      initial={{ transform: "scale(0)" }}
      animate={{ transform: "scale(1)" }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
      }}>

      <Box sx={{ ...ChatDisplay_Style, justifyContent: 'start' }}>
        <ChatMessage sx={{
          marginLeft: { md: '20px', xs: 0 },
          background: 'linear-gradient(319deg, rgb(255 255 255) 0%, rgb(186 173 255) 100%)',
          color: '#000',
          maxWidth: { xs: '100%', md: '70%' }
        }}>
          {messageHandler?.stream_message && <ReactMarkdown>
            {messageHandler?.stream_message}
          </ReactMarkdown>}
          <BubbleLeft xs={{ display: { xs: 'none', md: 'block' } }} />
        </ChatMessage>
        <Avatar xs={{ display: { xs: 'none', md: 'block' } }} alt="ChatBot" src={botAvatar} />
      </Box>
    </motion.div>
  )
}

export default UserTypingMessageBlock