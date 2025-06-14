import { Box, Breadcrumbs, Button, Chip, FormControl, IconButton, Input, InputLabel, Link, Skeleton, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import MuiTable from '~/components/MuiTable/MuiTable';
import { useDispatch, useSelector } from 'react-redux';
import Block from '~/components/Mui/Block';
import { useDocument } from '~/apis/Document';
import ExternalWebsite from '~/components/ExternalWebsite ';
import MemoryIcon from '@mui/icons-material/Memory';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const domain = import.meta.env.VITE_SERVER

function createData(id, chunk) {
  return { id, chunk };
}

const useData = (chunks) => {
  if (!chunks) return { rows: [], columns: [] }

  const rows = chunks.map((data) => {
    const { chunk_id, article } = data
    return createData(chunk_id, article)
  })


  const columns = [
    {
      field: 'chunk',
      headerName: 'Đoạn Cắt Từ Tài Liệu',
      width: 520,
      renderCell: (params) => (
        <Tooltip title={params.id} placement="top-end" >
          <Typography variant='p' component='p'
            sx={{
              textAlign: 'justify', padding: '5px 0', height: '100%', paddingX: 1,
              maxHeight: '67px', width: '100%', whiteSpace: 'nowrap', textWrap: 'wrap', lineHeight: '15px', overflow: 'hidden',
              textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical'
            }}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    }
  ];

  return { rows, columns }
}

function DatasetDetail() {
  const navigate = useNavigate()

  const { id, collection } = useParams()
  const { processHandler, noticeHandler, dashboard, getModal } = useOutletContext()

  const [documentWithChunk, setDocumentWithChunk] = useState(null)
  const [openModalUpload, setOpenModalUpload] = useState(false)
  const [openModalChunking, setOpenModalChunking] = useState(false)
  const [schema, setSchema] = useState(null)
  const [chunk_id, set_chunk_id] = useState(null)

  const token = useSelector(state => state.auth.token)

  useEffect(() => {
    document.title = 'Chatbot - Quản Lý Tri Thức - Tài Liệu'
    dashboard.navigate.active(346)

    return () => {
      dashboard.navigate.active('#')
    }
  }, [])

  const dispatch = useDispatch()
  const list_documents_in_store = useSelector(state => state.reducers.list_documents)
  const list_collections_in_store = useSelector(state => state.reducers.list_collections)

  const collection_name = collection
  const document_id = id
  useEffect(() => {
    if (list_documents_in_store && list_documents_in_store[collection_name]) {
      list_documents_in_store[collection_name].documents.forEach((document) => {
        if (document.document_id == document_id) {
          setDocumentWithChunk(document)
        }
      })
    } else if (token && !list_documents_in_store) {
      const loadCollectionWithDocument = processHandler.add('#loadCollectionWithDocument')
      useApi.get_document_in_collection(token, collection_name)
        .then((document) => { dispatch(list_documents_action(collection_name, document)) })
        .catch((error) => { console.error('Lấy Dữ Liệu Files Trong Collection Thất Bại', error) })
        .finally(() => processHandler.remove('#loadCollectionWithDocument', loadCollectionWithDocument))
    }


    if (list_documents_in_store && !list_documents_in_store[collection_name]?.schema && token) {
      const getCollectionEvent = processHandler.add('#getCollection')
      useApi.get_chat_collection(token).then((collections) => {
        processHandler.remove('#getCollection', getCollectionEvent)
        dispatch(list_documents_action(collection_name, {
          ...list_documents_in_store[collection_name],
          schema: collections.filter((collection) => collection.collection_name == collection_name)[0]?.schema
        }))
        setSchema(collections.filter((collection) => collection.collection_name == collection_name)[0]?.schema)
        return collections
      }).catch((error) => {
        processHandler.remove('#getCollection', getCollectionEvent)
        noticeHandler.add({
          status: 'error',
          message: error
        })
      })
    }



    // if (token) {
    //   const event = processHandler.add('#loadDocumentWithChunk')
    //   loadDocumentWithChunk(id, token).then((documentWithChunk) => { setDocumentWithChunk(documentWithChunk) })
    //     .catch((err) => console.error('Tải Thông Tin Tài Liệu (Chunks) Thất Bại !'))
    //     .finally(() => processHandler.remove('#loadDocumentWithChunk', event))

    //   const loadCollectionSchemaEvent = processHandler.add('#loadCollectionSchema')
    //   loadCollectionSchema(collection, token).then((schema) => setSchema(schema))
    //     .catch((err) => { console.error("Tải Thông Tin Collections Schema Thất Bại !"); setSchema(null) })
    //     .finally(() => processHandler.remove('#loadCollectionSchema', loadCollectionSchemaEvent))
    // }

  }, [token, list_documents_in_store, list_collections_in_store])

  const loadCollectionSchema = async (collection_id, token) => {
    return useApi.get_collection_schema(token, collection_id).then((document) => { console.log('collection schema: ', document); return document })
  }

  const loadDocumentWithChunk = async (document_id, token) => {
    return useDocument.getDocumentWithChunk(document_id, token).then((document) => document)
  }

  const DocumentUpdate = async (new_data) => {  // document schema
    if (documentWithChunk?.state == 'processed' || documentWithChunk?.state == 'success') {
      noticeHandler.add({
        status: 'error',
        message: 'Cập Nhật Thất Bại, Tài Liệu Này Đã Được Xử Lý !'
      })
      return
    }
    const UpdateDocumentEvent = processHandler.add('#UpdateDocument')
    // await 
    // await useDocument.update(new_data, token).then((document) => {
    //   setDocumentWithChunk(prev => ({ ...document, chunks: prev.chunks, amount_chunking: prev.chunks.length }))
    //   noticeHandler.add({
    //     status: 'success',
    //     message: 'Cập Nhật Dữ Liệu Thành Công'
    //   })
    // })
    //   .catch((err) => {
    //     noticeHandler.add({
    //       status: 'error',
    //       message: err
    //     })
    //   })
    //   .finally(() => processHandler.remove('#UpdateDocument', UpdateDocumentEvent))
  }

  const ProcessButton = async () => {
    if (documentWithChunk?.state == 'processed' || documentWithChunk?.state == 'success') {
      noticeHandler.add({
        status: 'warning',
        message: 'Tài Liệu Này Đã Được Xử Lý !'
      })
      return
    }
    if (documentWithChunk?.metadata == null) {
      noticeHandler.add({
        status: 'warning',
        message: 'Bạn Phải Điền Đầy Đủ Thông Tin Cần Có !'
      })
      return
    }
    const data = {
      id: id,
      chunks: documentWithChunk.chunks.map((data) => data.chunk)
    }
    const processDocumentEvent = processHandler.add('#processDocument')
    await useDocument.process(data, token).then(
      (data) => {
        noticeHandler.add({
          status: 'success',
          message: 'Tài Liệu Đã Được Đưa Vào Hàng Đợi Xử Lý'
        })
        navigate(`/knowledge_bases/${collection}`)
      }
    )
      .catch(() => {
        noticeHandler.add({
          status: 'error',
          message: 'Lỗi hàng Đợi, Vui Lòng Thử Lại Sau !'
        })
      })
      .finally(() => processHandler.remove('#processDocument', processDocumentEvent))
  }

  const EnhanceButton = async () => {
    if (documentWithChunk?.state == 'processed' || documentWithChunk?.state == 'success') {
      noticeHandler.add({
        status: 'warning',
        message: 'Tài Liệu Này Đã Được Xử Lý !'
      })
      return
    }
    const data = {
      id: id,
      ...documentWithChunk,
      article: documentWithChunk.chunks.map((data) => data.chunk).join(" ## ")
    }

    const processDocumentEvent = processHandler.add('#processDocument')
    await useDocument.enhance(data, token).then(
      (data) => {
        if (token) {
          try {
            setDocumentWithChunk(data)
            noticeHandler.add({
              status: 'success',
              message: 'Tạo Dữ Liệu Tự Động Thành Công!'
            })
          } catch (error) {
            throw {
              status: 'error',
              message: 'Tạo Dữ Liệu Tự Động Thất Bại!'
            }
          }
        }
      }
    )
      .catch(() => {
        noticeHandler.add({
          status: 'error',
          message: 'Tạo Dữ Liệu Tự Động Thất Bại!'
        })
      })
      .finally(() => processHandler.remove('#processDocument', processDocumentEvent))
  }

  const actions = [
    {
      icon: <RemoveRedEyeOutlinedIcon />, name: 'Phóng To Tài Liệu', action: () => {
        if (documentWithChunk?.document_type && documentWithChunk?.document_type == "Upload") {
          window.open(`${domain}/documents?name=${documentWithChunk?.document_name_in_storage}`, '_blank');
        } else {
          window.open(documentWithChunk?.url, '_blank');
        }
      }
    },
    {
      icon: <AutoAwesomeIcon />, name: 'Cải Tiến Dữ Liệu Bằng AI', action: () => {
        getModal("Bạn Có Muốn Dữ Liệu Sẽ Được Làm Giàu Tự Động ? ",
          "Quá trình sẽ mất một chút thời gian. Các thông tin đoạn cắt, metadata sẽ được tự động viết lại cho phù hợp với ngữ cảnh. Tuy nhiên, hãy luôn nhớ kiểm tra lại dữ liệu bạn nhé !",
          "Tiếp Tục", EnhanceButton)
      }
    },
    { icon: <PostAddIcon />, name: 'Cập Nhật Metadata Bằng Thủ Công', action: () => setOpenModalUpload(true) },
  ];

  return (
    <Block sx={{ position: 'relative' }}>
      <Box sx={{ width: '100%', paddingTop: 1, height: 'auto', marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link underline="hover" key={id} color="inherit"
            onClick={() => navigate(`/knowledge_bases/${collection}`)}
            sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TopicOutlinedIcon />
          </Link>,
          <Typography key="62756213" sx={{ display: 'block', width: '100%', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> {documentWithChunk?.document_name} </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'end', width: 'fit-content', gap: 2 }}>
          <Button component="label" startIcon={<SaveAsIcon />} onClick={(e) => {
            DocumentUpdate({
              id: id,
              update: {
                chunks: documentWithChunk?.chunks,
                metadata: documentWithChunk?.metadata
              }
            })
          }}
            sx={{ color: '#fff', background: theme => theme.palette.primary.main, paddingX: 2, paddingY: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }} >
            Lưu Thay Đổi
          </Button>

          <Button component="label" startIcon={<MemoryIcon />} color={'error'} variant='contained'
            onClick={() => getModal("Bạn Có Muốn Xử Lý Tài Liệu ? ",
              "Quá trình sẽ mất một chút thời gian. Để tài liệu hoạt động một cách hiệu quả nhất, hãy chắc chắn rằng các nội dụng (metadata and text chunk) của bạn thật rõ ràng mạch lạc",
              "Tiếp Tục", ProcessButton)}
            sx={{ paddingX: 2, paddingY: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
          > Xử Lý Tài Liệu
          </Button>

        </Box>
      </Box>

      <Box sx={{ height: 'calc(100vh - 126px)', marginTop: 1.5, borderRadius: '15px', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ width: '60%', minWidth: '450px' }}>
          <Box sx={{ width: '100%', height: 'calc(100% - 0px)' }}>
            <MuiTable onRowClick={(e) => { setOpenModalChunking(true); set_chunk_id(e.id) }}
              rowHeight={101} useData={useData(documentWithChunk?.chunks)} />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', padding: 2 }}>

          </Box>
        </Box>

        <Box sx={{
          width: '38%', height: '100%', borderRadius: '15px', padding: 2,
          background: theme => theme.palette.mode == 'dark' ? '#ffffff75' : '#32363952',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)',
        }}>
          <ExternalWebsite name={documentWithChunk?.document_name_in_storage} type={documentWithChunk?.document_type} url={documentWithChunk?.url} />
        </Box>
      </Box>

      {openModalUpload && <SettingDocumentModal
        document={{
          id: id,
          getMetadata: () => documentWithChunk?.metadata[0],
          state: documentWithChunk?.state,
          setMetadata: (value) => {
            if (documentWithChunk?.state != 'pending') return false
            setDocumentWithChunk(prev => {
              return { ...prev, metadata: { ...prev.metadata, ...value } }
            })
            return true
          },
          getName: () => documentWithChunk?.document_name,
          setName: (value) => {
            if (documentWithChunk?.state != 'pending') return false
            setDocumentWithChunk(prev => ({ ...prev, document_name: value }))
            return true
          }
        }}

        dashboard={dashboard}

        modalHandler={{
          state: openModalUpload,
          close: () => setOpenModalUpload(false),
          submit: DocumentUpdate,
          buffer: schema,
        }} />}

      {openModalChunking && <SettingChunkModal
        document={{
          id: id,
          state: documentWithChunk?.state,
          getChunk: (id) => {
            if (!documentWithChunk?.chunks) return ''
            const chunk = documentWithChunk?.chunks.filter((chunk) => {
              return chunk.chunk_id == id
            })
            return chunk[0].article
          },
          setChunks: (id, value) => {
            if (documentWithChunk?.state != 'pending')
              return false

            setDocumentWithChunk(prev => ({
              ...prev, chunks: prev.chunks.map((chunk) => {
                if (chunk.chunk_id == id)
                  return {
                    ...chunk,
                    article: value
                  }
                return chunk
              })
            }))
            return true
          },
          addChunk: (id, newChunk) => {
            const index = documentWithChunk?.chunks.findIndex((item) => item.chunk_id === id)
            if (index != -1) {
              documentWithChunk?.chunks.splice(index + 1, 0, newChunk);
            }
          },
          removeChunks: (ids = []) => {
            const new_chunks = documentWithChunk?.chunks.filter((chunks) => {
              return !ids.includes(chunks.chunk_id)
            })
            setDocumentWithChunk(prev => ({ ...prev, chunks: new_chunks }))
            return true
          }
        }}
        modalHandler={{
          state: openModalChunking,
          close: () => setOpenModalChunking(false),
          buffer: chunk_id,
        }} />}

      <SpeedDialTooltipOpen actions={actions} />

    </Block>
  )
}

export default DatasetDetail


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import { useCode } from '~/hooks/useMessage';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { CreateID } from '~/utils/CreateID';

function SettingDocumentModal({ document, modalHandler = null }) {

  const [error_message, setError_message] = useState(null)

  const [dataList, setDataList] = useState({})

  const handleSubmit = async (e) => {
    if (document?.state != 'pending') {
      setError_message('Tài Liệu Đã Hoặc Đang Được Xử Lý, Không Thể Thay Đổi !')
      return
    }

    const metadata = { ...document.getMetadata(), ...dataList }
    const document_name = document.getName()

    const condition = getSchema(modalHandler.buffer).every(
      data => metadata?.[data.key] && metadata[data.key] != '' && metadata[data.key] != [])

    if (!condition) {
      setError_message('Hãy Điền Tất Cả Các Trường Dữ Liệu! ')
      return
    }

    await modalHandler.submit(metadata)

    modalHandler.close()
  }

  const getSchema = (data) => {
    if (!data) return []
    const array = Object.entries(data).map(([key, value]) => {
      return { key, value };
    }).filter(
      (metaData) => !['created_at', 'updated_at', 'document_id', 'title', 'page_number', 'in_effect', 'file_links', 'url'].includes(metaData.key))
    return array
  }

  useEffect(() => {
    getSchema(modalHandler.buffer).forEach((data) => {
      if (data.value.type == 'list') {
        setDataList(prev => ({ ...prev, [data.key]: document.getMetadata()?.[data.key] }))
      }
    })
  }, [])

  return (
    <React.Fragment>
      <Dialog
        open={modalHandler?.state}
        onClose={() => { modalHandler?.close(); setError_message('') }}>
        <DialogTitle sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ width: '90vw', maxWidth: '600px', display: 'flex', alignItems: 'center', gap: 2 }}>
            Thông Tin Tài Liệu
          </Box>
        </DialogTitle>
        <DialogContent >
          <Box sx={{ display: 'flex', flexWrap: "wrap", paddingBottom: 1, gap: 2 }}>
            {
              modalHandler.buffer ?
                <>
                  <FormControl variant="standard" sx={{ width: '100%', color: 'inherit' }}>
                    <InputLabel sx={{ color: 'inherit !important' }}>Tên Tài Liệu</InputLabel>
                    <Input id="Description" value={document.getName()} onChange={(e) => {
                      if (e.target.value.length > 50) {
                        setError_message('Trường Dữ Liệu Không được quá 50 kí tự')
                        return
                      }
                      document.setName(e.target.value)
                    }}
                      sx={{ color: 'inherit', '--mui-palette-common-onBackgroundChannel': '0 0 0' }} />
                  </FormControl>

                  <Grid container spacing={3} sx={{ width: '100%' }}>
                    {
                      getSchema(modalHandler.buffer).map((data) => {

                        const element_type = data.value?.element_type
                        const type = data.value.type
                        const required = data.value.required
                        const name = data.key
                        const max_size = data.value?.max_size

                        const icon = (<Tooltip title={data.value.description} placement="top">
                          <IconButton aria-label="information" color='inherit'>
                            <HelpOutlineOutlinedIcon />
                          </IconButton>
                        </Tooltip>)

                        if (type == 'list') {

                          const ChipList = <Box sx={{ padding: 1, paddingRight: 2, display: 'flex', gap: 1, flexWrap: 'wrap', width: '700px', background: '#f0f8ff0f', borderRadius: '10px', marginBottom: 1, marginRight: 1 }}>
                            {dataList?.[name] && dataList[name].map((data) => {
                              return <Chip label={data} onDelete={() => {
                                setDataList(prev => ({
                                  ...prev, [name]: prev[name].filter((dataInList) => dataInList != data)
                                }))
                              }} />
                            })}
                          </Box>

                          return <>
                            <Grid size={12}>
                              <FormControl variant="standard" sx={{ width: '100%', color: 'inherit' }}>
                                <InputLabel sx={{ color: 'inherit !important' }}>{useCode(data?.key)}</InputLabel>
                                <Input endAdornment={data.value.description && icon} startAdornment={dataList?.[name] && dataList?.[name] != [] && ChipList}
                                  id="Description"
                                  value={console.log(document.getMetadata(), data, data.key) || document.getMetadata()?.[data.key]}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setDataList(prev => {
                                        if (prev?.[name]) {
                                          if (max_size && prev?.[name].length < max_size && e.target.value != '')
                                            return { ...prev, [name]: prev[name].concat(e.target.value) }
                                          setError_message(`Trường dữ liệu ${name} không được vượt quá ${max_size} hoặc bỏ trống`)
                                          return prev
                                        }
                                        return { ...prev, [name]: [e.target.value] }
                                      })
                                      e.target.value = ''
                                    }
                                  }}
                                  sx={{ color: 'inherit', '--mui-palette-common-onBackgroundChannel': '0 0 0' }} />
                              </FormControl>
                            </Grid>
                          </>
                        }

                        if (type == 'int') {
                          return <Grid size={6}>
                            <FormControl variant="standard" sx={{ width: '100%', color: 'inherit' }}>
                              <InputLabel sx={{ color: 'inherit !important' }}>{useCode(data?.key)}</InputLabel>
                              <Input endAdornment={data.value.description && icon}
                                id="Description" value={document.getMetadata()?.[data.key]}
                                onChange={(e) => {
                                  if (Number.isInteger(Number(e.target.value))) {
                                    document.setMetadata({ [data.key]: e.target.value })
                                    return
                                  }
                                  setError_message(`Trường dữ liệu ${name} phải có giá trị là số nguyên`)
                                  e.target.value = document.getMetadata()?.[data.key] || ''
                                }}
                                sx={{ color: 'inherit', '--mui-palette-common-onBackgroundChannel': '0 0 0' }} />
                            </FormControl>
                          </Grid>
                        }

                        // String value
                        return <Grid size={6}>
                          <FormControl variant="standard" sx={{ width: '100%', color: 'inherit' }}>
                            <InputLabel sx={{ color: 'inherit !important' }}>{useCode(data.key)}</InputLabel>
                            <Input endAdornment={data.value.description && icon}
                              id="Description" value={document.getMetadata()?.[data.key]} onChange={(e) => document.setMetadata({ [data.key]: e.target.value })}
                              sx={{ color: 'inherit', '--mui-palette-common-onBackgroundChannel': '0 0 0' }} />
                          </FormControl>
                        </Grid>
                      })
                    }
                  </Grid>
                </> : <>
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                </>
            }
          </Box>
          <Typography sx={{ color: 'red', fontWeight: '900' }}>{error_message}</Typography>
        </DialogContent>
        <DialogActions>
          {modalHandler.buffer ?
            <Button loading onClick={handleSubmit} sx={{ color: 'green' }}>Lưu Thay Đổi</Button>
            : <Skeleton variant="rounded" width={90} height={30} />}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function SettingChunkModal({ document, modalHandler = null }) {

  const [dataList, setDataList] = useState([])

  useEffect(() => {
    modalHandler.buffer && setDataList([modalHandler.buffer])
  }, [modalHandler.buffer])

  return (
    <React.Fragment>
      <Dialog
        sx={{ '& .MuiPaper-root': { width: '80vw', maxWidth: 'none !important' } }}
        open={modalHandler?.state}
        onClose={() => { modalHandler?.close(); setDataList([]) }}>
        <DialogTitle sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ width: '90vw', maxWidth: '600px', display: 'flex', alignItems: 'center', gap: 2 }}>
            Chỉnh Sửa Đoạn Cắt
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {
            dataList && dataList.map((id) => console.log(id) || (
              <TextField maxRows={8} multiline fullWidth
                value={document.getChunk(id)}
                sx={{ '& textarea': { color: '#000' } }}
                onChange={(e) => console.log(e.target.value) || document.setChunks(id, e.target.value)}
                placeholder='Nhập thay đổi'
              />
            ))
          }
        </DialogContent>
        <DialogActions>

          <Button onClick={() => {
            const id = CreateID(100)
            document.addChunk(dataList[dataList.length - 1], {
              chunk_id: id,
              article: ''
            }),
              setDataList(prev => [...prev, id])
          }} sx={{ color: '#000' }}>Thêm Đoạn Cắt</Button>

          <Button onClick={() => {
            document.removeChunks(dataList)
            modalHandler?.close()
            setDataList([])
          }}
            sx={{ color: 'red' }}>Xóa Tất Cả</Button>

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PostAddIcon from '@mui/icons-material/PostAdd';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(1.5),
    right: theme.spacing(1.5),
    '& > button': {
      background: 'var(--mui-palette-background-paper)',
      padding: 2,
      boxShadow: '0px -10px 10px rgb(255 255 255 / 25%), 0px 3px 10px rgb(255 255 255 / 19%)'
    }
  },

  '--mui-palette-background-paper': theme.palette.mode == 'dark' ? '#2d325a' : '#005181',
  '--mui-palette-SpeedDialAction-fabHoverBg': '#012032',

  '.MuiSpeedDialAction-staticTooltipLabel': {
    width: 'max-content',
    borderRadius: '10px',
    padding: '8px',
    paddingRight: '16px',
    paddingLeft: '16px',
    background: 'var(--mui-palette-background-paper)'
  },

  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },

}));
import { styled } from '@mui/material/styles';
import { useApi } from '~/apis/apiRoute';
import { list_documents_action } from '~/store/actions/actions';
export function SpeedDialTooltipOpen({ actions }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const handleClose = () => setOpen(true);

  const [state, setState] = useState({})

  return (
    <Box sx={{ ...state, transform: 'translateZ(0px)', flexGrow: 1, position: 'absolute', bottom: '0', right: '0' }}>
      <Backdrop open={open} sx={{ background: '#cccccc66', borderRadius: '15px' }} />
      <StyledSpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        onMouseOver={() => setState({ width: '100%', height: '100%' })}
        onMouseOut={() => setState({})}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => { action?.action(); handleClose() }}
          />
        ))}
      </StyledSpeedDial>
    </Box>
  );
}