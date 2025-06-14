import Box from '@mui/material/Box'
import Block from '~/components/Mui/Block'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, IconButton, MenuItem, Paper, Select, Skeleton, TextField, Typography } from '@mui/material'
import styled from '@emotion/styled'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import { useNavigate, useOutletContext } from 'react-router-dom'
import { formatTime } from '~/utils/GetTime'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Header = styled(Box)(({ theme }) => ({
  background: theme.palette.mode == 'dark' ? 'rgb(45, 50, 90)' : 'rgb(0, 81, 129)', width: '100%',
  display: 'flex', justifyContent: 'end',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', height: theme.spacing(6),
  position: 'absolute', right: 0, top: '0', borderRadius: '14px 14px 0 0 ', zIndex: 20, paddingLeft: theme.spacing(4)
}))

function KnowledgeBase() {

  const nagative = useNavigate()
  const dispatch = useDispatch()

  const PARENT_DIRECTION = '/knowledge_bases/'
  const token = useSelector(state => state.auth.token)
  const [Collections, setCollections] = useState(null)

  const { processHandler, dashboard, noticeHandler, getModal } = useOutletContext();

  const [disableRipple, setDisableRipple] = useState(false)
  const [chosenCollection, setChosenCollection] = useState(null)

  const role = useSelector(state => state.auth.user?.role)
  const list_collections_in_store = useSelector(state => state.reducers.list_collections)



  useEffect(() => {
    document.title = 'Chatbot - Quản Lý Tri Thức'
    dashboard.navigate.active(346)

    return () => (dashboard.navigate.active('#'))
  }, [])

  useEffect(() => {
    if (list_collections_in_store) {
      setCollections(list_collections_in_store)
    }
    else if (token) {
      getCollection(token).then((collections) => {
        setCollections(collections)
        dispatch(list_collections_action(collections))
      }).catch((err) => console.error('Lấy Danh Sách Collection Thất Bại !'))
    }
  }, [token])


  const getCollection = async (token) => {
    const getCollectionEvent = processHandler.add('#getCollection')
    return useApi.get_chat_collection(token).then((collections) => {
      processHandler.remove('#getCollection', getCollectionEvent)
      return collections
    }).catch((error) => {
      processHandler.remove('#getCollection', getCollectionEvent)
      noticeHandler.add({
        status: 'error',
        message: error
      })
    })
  }

  const handleEnter = (index) => {
    setDisableRipple(true)
    setChosenCollection(index)
    return true
  }
  const handleLeave = () => {
    setDisableRipple(false)
    setChosenCollection(null)
    return true
  }

  const editCollection = async (event, collection) => {
    noticeHandler.add({
      status: 'warning',
      message: 'Tính năng chưa hỗ trợ !'
    })
  }

  const removeCollection = async (event, collection) => {
    event.preventDefault()

    const action = async (collection) => {
      const removeCollectionEvent = processHandler.add('#removeCollection')
      token && await useApi.delete_chat_collection(token, collection.collection_name)
        .then(async () => {
          if (token) {
            getCollection(token).then((collections) => {
              setCollections(collections)
            }).catch(() => console.error('Lấy Danh Sách Collection Thất Bại !'))
          }
        })
        .catch(() => {
          noticeHandler.add({
            status: 'error',
            message: 'Xóa Chủ Đề Thất Bại !'
          })
        })
        .finally(() => processHandler.remove('#removeCollection', removeCollectionEvent))
    }

    if (collection.type != 'upload') {
      noticeHandler.add({
        status: 'warning',
        message: 'Bạn không thể xóa chủ đề mặc định'
      })
      return
    }

    getModal('Xác Nhận Xóa Chủ Đề', 'Chủ Đề Này Đã Có Tài Liệu, Bạn Có Chắc Chắn Muốn Xóa Chủ Đề Này?', 'Xác Nhận', () => action(collection))

  }

  const options = [
    { title: 'Tùy Chỉnh', icon: <EditOutlinedIcon />, color: 'green', action: editCollection },
    { title: 'Xóa', icon: <DeleteOutlineOutlined />, color: 'red', action: removeCollection }
  ]

  return (
    <Block sx={{ paddingX: 4, paddingTop: 4, paddingRight: 1 }}>

      <Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 0.5 }}>
          <Typography variant='h1'
            sx={{ fontSize: '1.7rem', fontFamily: 'Roboto', fontWeight: '900', width: 'fit-content', color: theme => theme.palette.mode == 'dark' ? '#fff' : theme.palette.primary.main }}>
            Danh Sách Chủ Đề</Typography>
          <Box sx={{ marginRight: 2 }}>
            {role == 'administrator' && <Button startIcon={<AddBoxOutlinedIcon />} component="label" role={undefined} tabIndex={-1}
              onClick={() => getModal('Tạo Mới Chủ Đề', null, null, null, {
                content: NewCollection_Modal,
                props: { token, processHandler, noticeHandler, getCollection, setCollections }
              })}
              sx={{ marginRight: 3, color: '#fff', background: theme => theme.palette.primary.main, paddingX: 2, paddingY: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }} >
              Tạo mới chủ đề</Button>}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', paddingTop: 0.5, paddingBottom: 2, color: theme => theme.palette.mode == 'dark' ? '#fff' : '#727171', }}>
          <LightbulbOutlinedIcon sx={{ color: 'inherit', fontSize: '20px' }} />

          <Typography variant='p' component='p' fontSize={'0.925rem'}
            sx={{ fontWeight: '400', color: 'inherit', width: 'fit-content', textAlign: 'start' }}>
            Nền tảng tổ chức, lưu trữ thông tin giúp model có thể tiếp cận kiến thức hiệu quả và cung cấp kết quả mong muốn.</Typography>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 2, md: 4 }} columns={{ xs: 2, sm: 2, md: 4 }}
        sx={{ maxHeight: 'calc(100vh - 160px)', paddingY: '5px', paddingLeft: '2px', paddingBottom: 4, paddingRight: 2.5, overflow: 'auto', }}>
        {Collections && Collections.map((collection, zIndex) => (
          <Box sx={{ position: 'relative' }}>

            <Header>
              {role == 'administrator' && <IconButton disableRipple
                onMouseEnter={() => handleEnter(zIndex)} onMouseLeave={handleLeave}>
                <MoreVertIcon />
                {chosenCollection == zIndex && <Paper sx={{ width: 'max-content', zIndex: 1300, position: 'absolute', top: '40px', right: '0', borderRadius: '4px', background: '#e1ebff' }}>
                  <>
                    {options.map((option) => (
                      <Button
                        startIcon={option.icon}
                        sx={{ width: '100%', color: option?.color, fontSize: '0.825rem', width: 'fit-content', textAlign: 'start', fontWeight: '550' }}
                        key={option}
                        onClick={(event) => option.action(event, collection)}
                      >
                        {option.title}
                      </Button>
                    ))}
                  </>
                </Paper>}
              </IconButton>}
            </Header>


            <Button key={collection.collection_name} disableRipple onClick={() => !disableRipple && nagative(PARENT_DIRECTION + collection.collection_name, { state: { collection_name: collection.collection_name } })}
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'start', width: '210px', height: '210px', color: '#000', padding: 2, paddingTop: 7, borderRadius: '15px', position: 'relative', cursor: 'pointer',
                background: '#fefefe',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)',
                '&:active': !disableRipple && { transform: 'scale(0.98)' }
              }}>

              <Typography sx={{ fontSize: '1rem', width: 'fit-content', textAlign: 'start', fontWeight: '700' }}>
                {collection?.long_name}</Typography>

              <Typography variant='p' component='p'
                sx={{
                  paddingTop: '2px', fontSize: '0.725rem', fontWeight: '400', textAlign: 'left', maxHeight: '160px', width: '170px',
                  whiteSpace: 'nowrap', textWrap: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical'
                }}>
                {collection?.description}</Typography>
              <Box sx={{ position: 'absolute', height: '50px', display: 'flex', flexDirection: 'column', gap: 0.225, width: '100%', left: 0, bottom: 0, paddingX: 2 }}>
                <Typography fontSize={'0.725rem !important'} sx={{ color: 'inherit', width: 'fit-content', textAlign: 'start', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                  {collection.num_entities} Tài Liệu
                </Typography>
                <Typography fontSize={'0.725rem !important'} sx={{ color: 'inherit', width: 'fit-content', textAlign: 'start', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <DateRangeOutlinedIcon sx={{ fontSize: 18 }} />
                  {formatTime(collection.createdAt)}
                </Typography>
              </Box>
            </Button>
          </Box>
        ))}

        {!Collections && ['', '', '', ''].map((_data, index) => (<Skeleton key={index * 82715} variant="rounded" height={'200px'} width={'200px'} sx={{ marginBottom: 2, borderRadius: '15px' }} />))}
      </Grid>

    </Block>
  )
}

export default KnowledgeBase

const TEXTFIELD_STYLE = {
  '--mui-palette-text-secondary': '#6d6d6d',
  '& .MuiInputBase-root': {
    background: '#7d7d7d0d'
  },
  '& svg': {
    color: '#000'
  },
  '& fieldset': {
    color: '#000'
  },
  '& .MuiSlider-mark': {
    color: '#777',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  '& .MuiSlider-markLabel': {
    color: '#6d6d6d',
    // '&.MuiSlider-markLabelActive': {
    //   color: '#074307',
    //   fontWeight: '700'
    // }
  }
}
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useApi } from '~/apis/apiRoute'
import { list_collections_action } from '~/store/actions/actions'

export const NewCollection_Modal = ({ onClose, parent }) => {
  const [newMetadata, setMetadata] = useState([])

  const [newCollectionName, setCollectionName] = useState(null)
  const [newCollectionDescription, setCollectionDescription] = useState(null)
  const role = useSelector(state => state.auth.user?.role)
  const [notice, setNotice] = useState({})

  useEffect(() => {
    // setCollectionName(null)
    // setCollectionDescription(null)
    // setMetadata([])
    // setNotice({})
  }, [])

  const checkData = () => {
    setNotice({})
    let result = true
    if (!newCollectionName) {
      result = false,
        setNotice(prev => ({ ...prev, newCollectionName: { error: 'Lưu ý: Vui lòng điền tên chủ đề!' } }))
    }
    if (!newCollectionDescription) {
      result = false,
        setNotice(prev => ({ ...prev, newCollectionDescription: { error: 'Lưu ý: Vui lòng điền mô tả chủ đề!' } }))
    }
    newMetadata.map((metadata, index) => {
      if (!metadata?.name) {
        result = false,
          setNotice(prev => ({ ...prev, [index]: { metadata_name: { error: 'Vui lòng nhập tên cho metadata này!' } } }))
        return
      }

      if (!validateInput(metadata?.name)) {
        result = false,
          setNotice(prev => ({ ...prev, [index]: { metadata_name: { error: 'Tên metadata không được chứa tiếng việt có dấu, khoảng trắng hoặc kí tự đặc biệt!' } } }))
        return
      }

      if (!metadata?.description) {
        result = false,
          setNotice(prev => ({ ...prev, [index]: { metadata_description: { error: 'Vui lòng nhập mô tả cho metadata này!' } } }))
        return
      }
    })
    return result
  }
  const regex = /^[a-zA-Z0-9_]+$/;

  function validateInput(input) {
    return regex.test(input);
  }

  const changeNewMetadata = (newdata, index, rules) => {

    if (newdata?.datatype) {
      const params = Object.entries(newdata)[0][1] == 'string' ? { 'max_length': 200 } : {}
      setMetadata(prev => (prev.map((value, zIndex) => {
        if (zIndex != index) return value;
        return { ...value, ...newdata, params: params }
      })))
      return
    }

    setMetadata(prev => (prev.map((value, zIndex) => {
      if (zIndex != index) return value;
      return { ...value, ...newdata }
    })))
  }
  const token = useSelector(state => state.auth.token)
  const submit = async () => {

    if (!checkData()) return

    let metadata_format = {}
    newMetadata.map((value) => {
      metadata_format = {
        ...metadata_format,
        [value.name]: {
          description: value?.description,
          datatype: value?.datatype,
          params: value?.params
        }
      }
    })

    const eventCollection = parent.processHandler.add("#Create_collection")
    await useApi.create_chat_collection(token, newCollectionName, newCollectionDescription, metadata_format)
      .then(() => {
        parent.noticeHandler.add({
          status: 'success',
          message: 'Tạo collection thành công!'
        })
        if (parent.token) {
          parent.getCollection(parent.token).then((collections) => {
            parent.setCollections(collections)
          }).catch((err) => console.error('Lấy Danh Sách Collection Thất Bại !'))
        }
      })
      .catch((e) => {
        parent.noticeHandler.add({
          status: 'error',
          message: 'Có lỗi xảy ra khi lấy collection!'
        })
      })
      .finally(() => parent.processHandler.remove("#Create_collection", eventCollection))

    onClose()
  }

  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography> Cho phép người quản trị hoặc nhà phát triển định nghĩa và thêm các chủ đề mới vào hệ thống chatbot, từ đó mở rộng phạm vi kiến thức và khả năng phản hồi của nó.</Typography>
    <TextField value={newCollectionName || ''}
      onChange={(e) => setCollectionName(e.target.value)}
      sx={TEXTFIELD_STYLE} fullWidth label="Tên chủ đề (tiếng việt)" id="collection_name" placeholder='Nội Dung Nổi Bật Trong Năm 2025?' />
    <Typography sx={{ width: '100%', textAlign: 'end', color: 'red' }}>{notice?.newCollectionName?.error}</Typography>

    <TextField value={newCollectionDescription || ''} multiline rows={3}
      onChange={(e) => e.target.value.length < 100 && setCollectionDescription(e.target.value)}
      sx={TEXTFIELD_STYLE} fullWidth label="Mô Tả Chủ Đề" id="collection_description" placeholder={`Chủ đề nổi bật được sinh viên quan tâm năm 2025 bao gồm ...`} />
    <Typography sx={{ width: '100%', textAlign: 'end', color: 'red' }}>{notice?.newCollectionDescription?.error}</Typography>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='h6' component={'h6'}>Thêm metadata</Typography>
      <IconButton
        onClick={() => { setMetadata(prev => [...prev, { datatype: 'string', params: { 'max_length': 200 } }]) }}
        sx={{ background: '#cccccc6e' }} ><AddOutlinedIcon sx={{ color: '#000' }} /></IconButton>
    </Box>
    <Typography>Định nghĩa mô tả dữ liệu giúp cải thiện hiệu quả tìm kiếm dữ liệu sau này. </Typography>

    <Box sx={{ width: '100%', minHeight: '10px', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {newMetadata.map((value, index) => {
        return (
          <Box key={index * 928509245} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField value={value?.name || ''} onChange={e => {
                if (e.target.value.length > 50) return;
                changeNewMetadata({ name: e.target.value }, index)
              }}
                sx={TEXTFIELD_STYLE} fullWidth label={`Tên Dữ Liệu ${index + 1}`} id="metadata_name" placeholder='Tên gợi nhớ metadata' />
              <MoreVertOutlinedIcon />
              <Select label="Loại dữ liệu" value={value?.datatype} onChange={e => { changeNewMetadata({ datatype: e.target.value }, index) }}
                sx={TEXTFIELD_STYLE}>
                <MenuItem value="string">
                  <em>Chuỗi Ký Tự</em>
                </MenuItem>
                <MenuItem value="bool">
                  <em>True/False</em>
                </MenuItem>
                <MenuItem value="int">
                  <em>Số Nguyên</em>
                </MenuItem>
                <MenuItem value="float">
                  <em>Số Thập Phân</em>
                </MenuItem>
              </Select>
            </Box>
            <Typography sx={{ width: '100%', textAlign: 'end', color: 'red' }}>{notice[index]?.metadata_name?.error}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField value={value?.description || ''} onChange={e => {
                if (e.target.value.length > 500) return;
                changeNewMetadata({ description: e.target.value }, index)
              }} multiline maxRows={7}
                sx={TEXTFIELD_STYLE} fullWidth label={`Mô Tả Dữ Liệu ${index + 1}`} id="metadata_description" placeholder='Metadata này có ý nghĩa là gì?' />
              <IconButton
                onClick={() => { setMetadata(prev => prev.filter((value, zIndex) => index != zIndex)) }}
              ><DeleteOutlineOutlinedIcon sx={{ color: 'red' }} /></IconButton>
            </Box>
            <Typography sx={{ width: '100%', textAlign: 'end', color: 'red' }}>{notice[index]?.metadata_description?.error}</Typography>

          </Box>

        )
      })}
    </Box>
    {role == 'administrator' && <Button onClick={async () => await submit()}
      sx={{ color: '#fff', background: theme => theme.palette.primary.main, paddingX: 2, paddingY: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}
      variant='contained'>Tạo mới chủ đề</Button>}
  </Box>
}
