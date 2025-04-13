import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined";
import UnknowPage from '~/components/Page/UnknowPage';

function KnowledgeBaseRetrievalTesting() {
  const { id } = useParams();

  const {processHandler, dashboard, subDashboard } = useOutletContext();

  useEffect(() => {
    document.title = 'Chatbot - Quản Lý Tri Thức - Thử Nghiệm'
    dashboard.navigate.active(346)
    subDashboard.navigate.active(564)

    subDashboard.addActions( [
      { _id: 452, title: "Tập Dữ Liệu", icon: <DescriptionOutlinedIcon/>, link: "/knowledge_bases/" + id },
      { _id: 564, title: "Thử Nghiệm", icon: <BugReportOutlinedIcon/>, link: "/knowledge_bases/retrieval_testing/" + id },
      { _id: 893, title: "Cấu Hình", icon: <AdjustOutlinedIcon/>, link: "/knowledge_bases/configuration/" + id }]
    )
    
    return () => ( 
      dashboard.navigate.active('#'),
      subDashboard.navigate.active('#')
    )
  }, [])

  // useEffect(() => {
  //   document.title = 'Chatbot - Quản Lý Tri Thức - Thử Nghiệm'
  //   dispatch(sidebarAction({index: 346}))
  //   dispatch(navigate_subnav({index: 564, openSubSidebar : false}))

  //   // !navHandler.get() && navigate('/knowledge_bases/' + id)

  //   return () => (
  //     dispatch(sidebarAction({index: null}))
  //   )
  // })

  return (
    <UnknowPage/>
  )
}

export default KnowledgeBaseRetrievalTesting
