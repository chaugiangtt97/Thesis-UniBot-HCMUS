import { Box, Tooltip } from '@mui/material';
import React from 'react'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SyncIcon from '@mui/icons-material/Sync';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
const ACTION_LIST_DEFINE = {
    'rename': {
        icon: <DriveFileRenameOutlineOutlinedIcon sx={{ color: theme => theme.palette.mode =='dark' ? '#ac8dff' : '#2196f3', alignSelf: 'center', fontSize: '1rem' }} />,
        tooltip: 'Đổi Tên'
    },
    'see': {
        icon: <RemoveRedEyeOutlinedIcon sx={{ color: theme => theme.palette.mode =='dark' ? '#fff' : '#2196f3', alignSelf: 'center', fontSize: '1rem' }} />,
        tooltip: 'Trang Nguồn'
    },
    'delete': {
        icon: <DeleteOutlineOutlinedIcon sx={{ color: theme => theme.palette.mode =='dark' ? 'red' : 'red', alignSelf: 'center', fontSize: '1rem' }} />,
        tooltip: 'Xóa'
    },
    'download': {
        icon: <CloudDownloadOutlinedIcon sx={{ color: theme => theme.palette.mode =='dark' ? '#12a94d' : '#12a94d', alignSelf: 'center', fontSize: '1rem' }} />,
        tooltip: 'Tải Về'
    },
    'edit': {
        icon: <EditOutlinedIcon sx={{ color: theme => theme.palette.mode =='dark' ? '#ac8dff' : '#2196f3', alignSelf: 'center', fontSize: '1rem' }} />,
        tooltip: 'Chỉnh sửa'
    },
    'discovery': {
        icon: <SyncIcon sx={{ color: theme => theme.palette.mode =='dark' ? '#ffffff' : '#000000', alignSelf: 'center', fontSize: '1rem' }} />,
        tooltip: 'Phân tích'
    },
}

const ActionContainer = ({params, data}) => {
    return ( 
    <Box sx= {{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    }}>
        {params && params.map((type,index) => (
        <Box key = {index} 
            sx = {{ 
                '&:active' : {
                    transform: 'scale(0.9)'
                }
             }}
            onClick={async (event) => {
                event.stopPropagation();
                if(type?.action) { await type?.action(data) }

            }}>
            <Tooltip title={ACTION_LIST_DEFINE[type?.code || type]?.tooltip}>
                {ACTION_LIST_DEFINE[type?.code || type]?.icon}
            </Tooltip>
        </Box>))} 
    </Box>
)}

function MuiTableAction() {
  return (
    <div>
      
    </div>
  )
}

export const renderTableAction = (params) => {
  if (params.value == null) {
    return '';
  }
  const actionList = params.value
  const rowData = params.row
  const rowId = params.id

  return <ActionContainer params = {actionList} id = {rowId} data = {rowData}/>
}

export default MuiTableAction
