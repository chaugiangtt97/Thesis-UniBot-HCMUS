import React, { useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined";
import UnknowPage from '~/components/Page/UnknowPage';

function KnowledgeBaseConfiguration() {

  const {processHandler, dashboard, subDashboard } = useOutletContext();
  const { id } = useParams();
  useEffect(() => {
    document.title = 'Chatbot - Quản Lý Tri Thức'
    dashboard.navigate.active(346)
    subDashboard.navigate.active(893)

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

  return (
      <UnknowPage/>
  )
}

export default KnowledgeBaseConfiguration
