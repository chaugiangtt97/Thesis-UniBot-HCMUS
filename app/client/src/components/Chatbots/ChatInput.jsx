import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled';
import { Box, Button, TextField, CircularProgress, Tooltip, useColorScheme } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';

const InputGroup = styled(Box)(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  border: 'none'
}))

const TextField_Custom = styled(TextField)(({theme}) => ({
  width: '100%',
  '.MuiOutlinedInput-root': {
    padding: '4px 16px',
    '.MuiOutlinedInput-notchedOutline' : {
      border: 'none'
    },
    '.MuiOutlinedInput-input': {
        color: '#000',
        fontSize: '0.825rem'
    },
  }
}))

const Button_Custom = styled(Button)(({theme}) => ({
  background: theme.palette.primary.main, 
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)',
  color: '#fff',
  paddingY: 1,
  marginRight: '8px',
  height: '32px',
  '&:hover' : { 
    transform: 'scale(0.92)'
   }
}))

export function ChatInput({ id, text = null ,handleSubmit = null, messageHandler = null, disabled = false}) {
  const [input, setInput] = useState('')

  const Submit = async (event) => {
    event.preventDefault();
    if(input != '') handleSubmit(input) && setInput(null)
  }

  useEffect(() => {
    if(text != null) {
      setInput(text)
    }
  }, [text])

  return (
    <InputGroup id = {id} component="form" onSubmit={Submit} noValidate>
      <TextField_Custom
        maxRows={4}
        multiline
        inputProps={{ maxLength: 3000 }}
        value={input || ''}
        placeholder='Nhập câu hỏi - tối đa 3000 từ'
        disabled = {messageHandler.isProcess || disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') Submit(e) }}
        sx = {{ '& > div ': { background: 'transparent !important' } }}
      />

      <Button_Custom type="submit" disabled = {messageHandler.isProcess || disabled}>
        {messageHandler.isProcess || disabled ? 
          <CircularProgress color="inherit" size={15} /> 
          : <NearMeIcon fontSize='1.25rem'/> }
      </Button_Custom>
    </InputGroup>
  )
}
export default ChatInput
