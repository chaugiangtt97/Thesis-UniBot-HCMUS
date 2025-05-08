import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UnknowPage from '../../components/Page/UnknowPage';
import { useOutletContext } from 'react-router-dom';
import MuiTable from '~/components/MuiTable/MuiTable';
import { Box, Typography } from '@mui/material';
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";

const data = [
  {  "name": "Nguyễn Duy Đăng Khoa",
    "email": "nddkhoa21@clc.fitus.edu.vn",
    "password": "$2b$05$vCNAbrx7s.E7fzWIkLuNV.5Ye/EWYm78S.2Prnk3YzJ.BewGTS0s.",
    "role": "administrator",
    "verification": "a06280be-209a-4709-aca7-b66b0e978cd0",
    "verified": true }
]

function AccountManager() {
  const { dashboard } = useOutletContext();
  const role = useSelector(state => state.auth.user?.role || state.auth.user?.educationRole)

  useEffect(() => {
    document.title = 'Chatbot - Quản Lý Tài Khoản'
    dashboard.navigate.active(674)
    
    return () => ( dashboard.navigate.active('#') )
  }, [])

  return role != 'administrator' ? <UnknowPage/> : (
    <Box sx ={{ width: '100%', height: '100%', padding: 2 }}>
      <Box sx = {{ display: 'flex', gap: 1, alignItems:'center', paddingBottom: 1.2 }}>
        <Typography variant='h1' 
          sx = {{ fontSize: '1.8rem', fontFamily: 'Roboto', fontWeight: '900', width: 'fit-content', color: theme => theme.palette.mode == 'dark' ? '#fff' : theme.palette.primary.main }}>
            <PersonPinOutlinedIcon fontSize='large'/> Danh Sách Người Dùng </Typography>
      </Box>
      <Box sx={{ paddingBottom: 2, maxHeight: 'calc(100vh - 400px)', height: '100%',  width: '100%', background: 'transparent' }}>
        <MuiTable useData = {useData([])}/>
      </Box>

      <Box sx={{ paddingBottom: 2, maxHeight: 'calc(100vh - 180px)', height: '100%',  width: '100%', background: 'transparent' }}>
        <MuiTable useData = {useData([])}/>
      </Box>
    </Box>
  )
}

export default AccountManager

const useData = (documents) => {

  function createData(id = Math.floor(Math.random() * 72658721) , name= null, chunkNumber= null, upload_date= null, updated_date= null, chunkMethod= null, enable= null, parsingStatus= null, action= null) {
    return { id, name, chunkNumber, upload_date, updated_date, chunkMethod, enable, parsingStatus, action };
  }

  if(!documents) return {rows: [], columns: [], loading : false}
  const rows = Array.isArray(documents) && documents.map((document) => {
    let _id, document_name, amount_chunking, created_at, createdAt, updated_at, updatedAt, methods, isactive,state
    try {
      ( {_id, document_name, amount_chunking, created_at, createdAt, updated_at, updatedAt, methods, isactive,state} = document )
    } catch (error) {
      console.error('Có lỗi Xảy Ra Khi Đọc Tài Liệu')      
    }
    return createData(_id, document_name, amount_chunking, formatTime(created_at ? created_at : createdAt), formatTime(updated_at ? updated_at : updatedAt), methods, isactive,state, ['delete'] )
  })


  const columns = [
    { 
      field: 'id', headerName: 'ID', width: 50 
    },
    { 
      field: 'name', headerName: 'Họ và Tên', width: 120,         
      renderCell: (params) => (
        <Typography sx = {{ width: '50%', textAlign: 'center', lineHeight: '34px' }}>{params.value}</Typography>) 
    },
    { 
      field: 'email', headerName: 'Email', width: 150 
    },
    { 
      field: 'phone', headerName: 'Số Điện Thoại', width: 150 
    },
    { 
      field: 'major', headerName: 'Chuyên Ngành', width: 150 
    },
    { 
      field: 'session_number', headerName: 'Số Lượt Truy Cập', width: 150 
    },
    { 
      field: 'createdAt', headerName: 'Ngày Tạo', width: 150 
    }
  ];

  return {rows, columns, loading : false}
}