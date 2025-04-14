import React, { useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import Block from '~/components/Mui/Block'
import { Box, List, ListItemIcon, ListItemButton, ListItemText, styled, Typography, Avatar, Skeleton, Button } from '@mui/material'
import { deepOrange } from '@mui/material/colors'
import ReplyIcon from '@mui/icons-material/Reply'

const MuiListItemButton = styled(ListItemButton) (({theme}) => ({
  borderRadius: '10px', marginBottom:  theme.spacing(0.5), marginTop:  theme.spacing(0.5), paddingRight: theme.spacing(1), transition: 'none', 
  '& > div' : { transition: 'none', minWidth: '45px', color: theme.palette.mode == 'dark' ? '#a8a7a7' : '#565656', '& > span' : { fontWeight: 700, fontSize: '0.725rem !important' } },
  '&.Mui-selected' : { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', background: theme.palette.primary.main + '!important', fontWeight: 700, transition: 'none', 
    '& > div' : { color: '#fff', '& > span' : { fontWeight: 700 } } }}))  

function DashboardWithSubNavLayout() {
  const navigate = useNavigate()

  const [navInfor, setNavInfor] = useState(null)
  
  const [indexSelected, setIndexSelected] = useState(null)

  const [urlBack, setUrlBack] = useState(null)

  const subDashboard = { 
    navigate: { 
      active : (index) => setIndexSelected(index)
    },
    addTitle: (title) => setNavInfor(prev => ({...prev, title})),
    addActions: (action) => setNavInfor(prev => ({...prev, actions: action})),
    getTitle: () => navInfor?.title,
    getAction: () => navInfor?.action,
    get: () => navInfor
  }

  function stringAvatar(name) {
    if(name) return {
      children: `${name.split(' ')[0][0]}`,
    };
    return { children : '@' }
  }

  const handleListItemClick = (_event, index, address) => {
    setIndexSelected(index)
    navigate(address)
  }

  const backAction = () => {
    navigate(urlBack)
  }

  return (
    <Box sx = {{ height: '100%', width: '100%', paddingLeft: 28, position: 'relative', transform: 'scale(1)', transition: '0.5s all ease' }}>
      <Box sx = {{ position: 'absolute', height: '100%', width:  theme =>  theme.spacing(26), left: 0, top: 0, transition: 'inherit' }}>
        <Block sx ={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>

        {
          navInfor ? <>
          <Avatar variant="square"
            sx = {{ width: theme =>  theme.spacing(12), bgcolor: deepOrange[500], height: theme =>  theme.spacing(12), 
            background : theme =>  theme.palette.mode == 'dark' ? '#595976' :  '#cccccc4a', borderRadius: '50%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', 
            color: theme =>  theme.palette.mode == 'dark' ? '#fff' :  '#395064', fontSize: '2rem', fontWeight: '600' }} 
            {...stringAvatar(navInfor?.title)} />
        
          <Typography variant='h2' component= 'h2'  
            sx = {{ fontSize: '1rem', fontWeight: '900', textAlign: 'center', color: theme => theme.palette.mode == 'dark' ? '#ffffff' : '#233560' }}>
              {navInfor?.title || '@'}</Typography>

          <Box sx = {{ width: '100%', borderRadius: '15px' }}>
            <List component="nav">
              {navInfor?.actions && navInfor.actions.map((action, _index) => {
                return (
                  <MuiListItemButton key = {action._id} selected={action._id == indexSelected}
                    onClick={(event) => handleListItemClick(event, action._id, action.link)} >
                    <ListItemIcon> {action.icon} </ListItemIcon>
                    <ListItemText primary= {action.title}/>
                  </MuiListItemButton>
                )
              })} </List>
            </Box>
          </> : <>
            <Skeleton variant="circular" sx = {{ width: theme =>  theme.spacing(12), height: theme =>  theme.spacing(12) }} />
            <Skeleton variant="rounded" height={30} width={'70%'}/>
            <Skeleton variant="rounded" height={50} width={'100%'} sx = {{ borderRadius: '12px' }}/>
            <Skeleton variant="rounded" height={50} width={'100%'} sx = {{ borderRadius: '12px' }}/>
            <Skeleton variant="rounded" height={50} width={'100%'} sx = {{ borderRadius: '12px' }}/>
            <Skeleton variant="rounded" height={50} width={'100%'} sx = {{ borderRadius: '12px' }}/>
            <Skeleton variant="rounded" height={50} width={'100%'} sx = {{ borderRadius: '12px' }}/>
          </>
        }

        <Box sx = {{ position: 'absolute', bottom: '26px', width: '100%', paddingX: 2 }}>
          { urlBack && <Button startIcon= {<ReplyIcon/>} onClick={backAction} sx = {{ width: '100%', color: theme => theme.palette.mode == 'dark' ? '#d1d6ff' : '#005181' }}>Trở Về</Button> }
        </Box>

        </Block>
      </Box>

      <Block sx ={{ padding: 2, overflow: 'auto' }}>
        <Outlet context={{...useOutletContext(), subDashboard, setUrlBack }}/>
      </Block>
    </Box>
  )
}

export default DashboardWithSubNavLayout