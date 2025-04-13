import { Link, Tooltip } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function LinkComponent({params, link, condition}) {
    const navigate = useNavigate()
  return (
    <Tooltip title= {params.value}>
      <Link underline="always" 
        onClick={(event) => { event.stopPropagation(); condition && navigate(link) }}
        sx = {{ 
          color: theme => theme.palette.mode == 'dark' ? '#c9d5ff' : '#040085', 
          fontWeight: '400', cursor: 'pointer', width: '200px', display: 'block',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {params.value}
      </Link>
    </Tooltip>
  )
}

export const renderLink = ({params, link = null, condition = true}) => {
    if (params?.value == null) return ''
    return <LinkComponent params = {params} link = {link} condition = {condition}/>
}

export default LinkComponent
