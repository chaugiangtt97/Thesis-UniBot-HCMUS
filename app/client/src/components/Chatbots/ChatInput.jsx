import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled';
import { Box, Button, TextField, CircularProgress, Tooltip, useColorScheme } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';
import { useTranslation } from 'react-i18next';

const InputGroup = styled(Box)(({ theme }) => ({
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  justifyContent: 'space-between',
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(2.5)
  }
}))

const TextField_Custom = styled(TextField)(({ theme }) => ({
  width: '100%',
  '.MuiOutlinedInput-root': {
    padding: '4px 16px',
    '.MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '.MuiOutlinedInput-input': {
      color: '#000',
      fontSize: '0.825rem',
      [theme.breakpoints.up('xl')]: {
        fontSize: '1.525rem',
      }
    },
  }
}))

const Button_Custom = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('xl')]: {
    height: '42px',
    width: '82px'
  },
  background: theme.palette.primary.main,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)',
  color: '#fff',
  paddingY: 1,
  marginRight: '8px',
  height: '32px',
  '&:hover': {
    transform: 'scale(0.92)'
  }
}))

export function ChatInput({ id, text = null, handleSubmit = null, messageHandler = null, disabled = false }) {
  const [input, setInput] = useState('')

  const Submit = async (event) => {
    event.preventDefault();
    if (input != '') handleSubmit(input) && setInput(null)
  }

  useEffect(() => {
    if (text != null) {
      setInput(text)
    }
  }, [text])

  const { t } = useTranslation();

  return (
    <InputGroup id={id} component="form" onSubmit={Submit} noValidate>
      <TextField_Custom
        maxRows={4}
        multiline
        inputProps={{ maxLength: 3000 }}
        value={input || ''}
        placeholder={t('question_input_hint')}// 'Nhập câu hỏi - tối đa 3000 từ'
        disabled={messageHandler.isProcess || disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') Submit(e) }}
        sx={{ '& > div ': { background: 'transparent !important' } }}
      />

      <Button_Custom type="submit" disabled={messageHandler.isProcess || disabled}>
        {messageHandler.isProcess || disabled ?
          <CircularProgress color="inherit" size={15} />
          : <NearMeIcon sx={{ '& svg': { width: '5em', height: '5em' } }} />}
      </Button_Custom>
    </InputGroup>
  )
}
export default ChatInput
