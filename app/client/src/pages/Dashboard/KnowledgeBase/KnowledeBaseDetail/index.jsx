import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MuiTable from '~/components/MuiTable/MuiTable';
import { renderStatus } from '~/components/MuiTable/cell-renderers/status';
import { renderControlledSwitches } from '~/components/MuiTable/cell-renderers/switch'
import { renderTableAction } from '~/components/MuiTable/MuiTableAction';
import { renderLink } from '~/components/MuiTable/cell-renderers/link';
import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useCollection } from '~/apis/Collection';
import { useOutletContext } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { formatTime } from '~/utils/GetTime';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import { VisuallyHiddenInput } from '~/components/Mui/InputFileUpload';
import { useDocument } from '~/apis/Document';
import { Airflow } from '~/socket/Airflow';
import { getSocket } from '~/socket';
import { useApi } from '~/apis/apiRoute';
import { list_documents_action } from '~/store/actions/actions';

const useData = (documents, deleteDocument = null) => {
  const { id } = useParams();
  function createData(id = Math.floor(Math.random() * 72658721), name = null, chunkNumber = null, upload_date = null, updated_date = null, chunkMethod = null, enable = null, parsingStatus = null, action = null, url = null) {
    return { id, name, chunkNumber, upload_date, updated_date, chunkMethod, enable, parsingStatus, action, url };
  }

  const directUrl = async (documentWithChunk) => {
    if (documentWithChunk?.type && documentWithChunk?.type == "Upload") {
      window.open(`${domain}/documents?name=${documentWithChunk?.name}`, '_blank');
    } else {
      window.open(documentWithChunk?.url, '_blank');
    }
  }

  if (!documents) return { rows: [], columns: [], loading: false }
  console.log(documents)

  const rows = Array.isArray(documents) && documents.map((document) => {
    let document_id, document_name, num_entities, methods, state, url
    try {
      ({ document_id, document_name, num_entities, methods, state, url } = document)
    } catch (error) {
      console.error('Có lỗi Xảy ra khi đọc tài liệu', error)
    }

    return createData(document_id, document_name, num_entities, formatTime(document?.created_at || document?.createdAt),
      formatTime(document?.updated_at || document?.updatedAt), methods, document?.isactive || document?.is_active, state,
      [{ code: 'see', action: directUrl },
      { code: 'delete', action: deleteDocument }], url)

  })

  const condition = (params) => { return ['processed', 'pending', 'failed', 'success'].includes(params.row.parsingStatus) }

  const getLinkToDocument = (params) => { return `/knowledge_bases/${id}/${params.row.id}` }

  const columns = [
    {
      field: 'name', headerName: 'Tên Tài Liệu', width: 240,
      renderCell: (params) => {
        return <Box sx={{ paddingLeft: 1 }}>
          {renderLink({ params: params, link: getLinkToDocument(params), condition: condition(params) })}
        </Box>
      },
    },
    {
      field: 'chunkNumber', headerName: 'Số Đoạn Cắt', width: 120,
      renderCell: (params) => (
        <Typography sx={{ width: '50%', textAlign: 'center', lineHeight: '34px' }}>{params.value}</Typography>)
    },
    {
      field: 'parsingStatus', headerName: 'Trạng Thái Phân Tích', width: 180, type: 'singleSelect',
      renderCell: renderStatus
    },
    {
      field: 'upload_date', headerName: 'Ngày Tạo', width: 150
    },
    {
      field: 'updated_date', headerName: 'Chỉnh Sửa Lần Cuối', width: 150
    },
    {
      field: 'enable', headerName: 'Trạng Thái Hoạt Động', width: 160,
      renderCell: renderControlledSwitches,
    },
    {
      field: 'chunkMethod', headerName: 'Phương Pháp Cắt Đoạn', width: 160,
      renderCell: renderStatus,
    },
    {
      field: 'action', headerName: '', width: 90,
      renderCell: renderTableAction
    }
  ];

  return { rows, columns, loading: false }
}

function Datasets() {
  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token)
  const [collectionWithDocuments, setCollectionWithDocuments] = useState(null)

  const { processHandler, noticeHandler, subDashboard, dashboard, setUrlBack } = useOutletContext();
  const [loadTable, setLoadTable] = useState(false)

  const socket = getSocket();

  useEffect(() => {
    document.title = 'Chatbot - Quản Lý Tri Thức - Tài Liệu'

    subDashboard.navigate.active(452)
    dashboard.navigate.active(346)
    subDashboard.addActions([
      { _id: 452, title: "Tập Dữ Liệu", icon: <DescriptionOutlinedIcon />, link: "/knowledge_bases/" + id }
      // { _id: 564, title: "Thử Nghiệm", icon: <BugReportOutlinedIcon/>, link: "/knowledge_bases/retrieval_testing/" + id },
      // { _id: 893, title: "Cấu Hình", icon: <AdjustOutlinedIcon/>, link: "/knowledge_bases/configuration/" + id }
    ])

    setUrlBack(('/knowledge_bases'))

  }, [])

  const { id } = useParams();
  const collection_name = id

  const loadDocumentByCollectionName = async (collection_name, token) => {
    setLoadTable(true)
    return useApi.get_document_in_collection(token, collection_name)
      .then((document) => { setLoadTable(false); return document })
      .catch((error) => { setLoadTable(false); return error })
  }

  const list_documents_in_store = useSelector(state => state.reducers.list_documents)
  const dispatch = useDispatch()
  useEffect(() => {
    if (list_documents_in_store && list_documents_in_store[collection_name]) {
      setCollectionWithDocuments(list_documents_in_store[collection_name])
    }
    else if (token) {
      const loadCollectionWithDocument = processHandler.add('#loadCollectionWithDocument')
      loadDocumentByCollectionName(collection_name, token).then((collectionWithDocuments) => {
        setCollectionWithDocuments(collectionWithDocuments)
        dispatch(list_documents_action(collection_name, collectionWithDocuments))
        subDashboard.addTitle(collectionWithDocuments.long_name)
      }).catch((err) => console.error('Lấy Dữ Liệu Files Trong Collection Thất Bại'))
        .finally(() => processHandler.remove('#loadCollectionWithDocument', loadCollectionWithDocument))
    }
  }, [token])

  useEffect(() => {
    try {
      collectionWithDocuments?.documents && Array.isArray(collectionWithDocuments?.documents) && collectionWithDocuments?.documents.map((document, index) => {
        if (document?.document_type && document.document_type == 'Upload'
          && document?.state && (document?.state == 'queued' || document?.state == 'running')) {

          Airflow.CheckStatus(socket, {
            dag_id: document?.dag_id,
            dag_run_id: document?.dag_run_id,
            file_id: document?._id,
            state: document?.state
          })

          Airflow.getStatus(socket, (data) => {
            if (document._id === data.file_id && document?.state
              && collectionWithDocuments.documents[index]?.state != data.state) {
              Array.isArray(collectionWithDocuments?.documents) && setCollectionWithDocuments((prevs) => (
                {
                  ...prevs, documents: prevs.documents.map(document => {
                    if (document._id === data.file_id && document?.state
                      && document.state != data.state) {
                      return { ...document, state: data.state, enable: data?.isactive }
                    }
                    return document
                  })
                }
              ))

            }

          })

        }
      })
    } catch (e) {
      noticeHandler.add({ status: 'error', message: 'Lỗi Xảy Ra Khi Tải Dữ Liệu' })
    }
  }, [collectionWithDocuments, getSocket()])

  const uploadFileHandler = (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('collection', id)
    formData.append('filename', encodeURI((e.target.files[0].name)))
    console.log(e.target.files)
    const uploadFileEvent = processHandler.add('#uploadFile')
    useApi.upload_file(token, formData).then((newDocument) => {
      setCollectionWithDocuments(prev => ({ ...prev, documents: [newDocument.document, ...prev.documents] }))
      noticeHandler.add({ status: 'success', message: 'Thêm tài liệu thành công' })
    }).catch((err) => noticeHandler.add({ status: 'error', message: err }))
      .finally(() => processHandler.remove('#uploadFile', uploadFileEvent))
  }

  const refreshData = async () => {
    const loadCollectionWithDocument = processHandler.add('#loadCollectionWithDocument')
    loadDocumentByCollectionName(collection_name, token).then((collectionWithDocuments) => {
      setCollectionWithDocuments(collectionWithDocuments)
      subDashboard.addTitle(collectionWithDocuments.long_name)
    }).catch((err) => console.error('Lấy Dữ Liệu Files Trong Collection Thất Bại'))
      .finally(() => processHandler.remove('#loadCollectionWithDocument', loadCollectionWithDocument))
  }

  const deleteDocument = async (data) => {
    console.log(data)
    if (data?.id) {
      const deleteEvent = processHandler.add('#deleteDocument')
      await useDocument.deleteDocument({ id: data.id }, token)
        .then(async () => {
          noticeHandler.add({ status: 'success', message: 'Xóa Tài Liệu Thành Công' })
          await refreshData()
            .catch(() => noticeHandler.add({ status: 'error', message: 'Refresh Trang Xảy Ra Lỗi' }))
        })
        .catch(() => noticeHandler.add({ status: 'error', message: 'Xóa Tài Liệu Thất Bại' }))
        .finally(() => processHandler.remove('#deleteDocument', deleteEvent))
    }
  }

  return (
    <>
      <Box sx={{ width: '100%', height: 'auto', marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link underline="hover" key="2657812" color="inherit"
            onClick={(e) => {
              e.preventDefault()
              navigate('/knowledge_bases')
            }}
            sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TopicOutlinedIcon sx={{ color: theme => theme.palette.text.secondary }} />
          </Link>,
          <Typography key={id}>
            {collectionWithDocuments?.long_name || 'Không có tên kho dữ liệu'}
          </Typography>,
        </Breadcrumbs>

        <Box>
          <Button startIcon={<AddIcon />} component="label" role={undefined} tabIndex={-1}
            sx={{ color: '#fff', background: theme => theme.palette.primary.main, paddingX: 2, paddingY: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }} >
            Thêm Tài Liệu
            <VisuallyHiddenInput
              type="file"
              onChange={uploadFileHandler}
            />
          </Button>
        </Box>
      </Box>

      <Box sx={{ maxHeight: 'calc(100vh - 130px)', height: '100%', width: '100%', background: 'transparent' }}>
        <MuiTable loading={loadTable} useData={useData(collectionWithDocuments?.documents, deleteDocument)} />
      </Box>
    </>
  )
}

export default Datasets