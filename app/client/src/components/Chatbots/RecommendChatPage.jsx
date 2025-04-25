import React, { useEffect, useState } from 'react'
import { Box, Skeleton, Typography } from '@mui/material';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import { useSelector } from 'react-redux';
import { useConservation } from '~/apis/Conservation';

const Container_Style = {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    paddingBottom: {md: 2, xs: 1},
    paddingTop: 1
}

const BLOCK_STYLE = {
  backgroundImage: theme => theme.palette.mode == 'dark' ? 'linear-gradient(164deg, #45485b 0%, #02041a91 100%)' 
  : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  color: theme => theme.palette.mode == 'dark' ? '#ffff' : 'var(--mui-palette-primary-main)',
  boxShadow: theme => theme.palette.mode == 'dark' ? 
  '3px 3px 3px 1px rgb(178 178 178 / 25%)' : '4px 5px 9px 0px rgb(0 0 0 / 30%), 0px 2px 4px rgb(0, 0, 0, 0.1)',
  cursor: 'pointer',
  fontWeight: '500',
  '&:hover': {
      color: '#fff',
      backgroundImage: theme => theme.palette.mode == 'dark' ? 'linear-gradient(164deg, #0e1c2f 0%, #02041a91 100%)' 
      : 'linear-gradient(120deg, #005181 0%, #1596e5fa 100%)' },
  '&:active': { transform: 'scale(0.9)' }
}

export function RecommendChatPage({ 
    loading = null, 
    username = null, 
    ChatAction = null,
    numPage = 0
}) {

  const token = useSelector(state => state.auth.token)
  const [recommendedQuestions, setRecommendedQuestions] = useState(null)

  useEffect(() => {
    if(token && recommendedQuestions == null) {
      useConservation.getRecommendedQuestions(token).then((_data) => {
        setRecommendedQuestions(_data)
      })
    }
  }, [token])

  // const mockData = ['Cho tôi biết danh sách học bổng khuyến học mới nhất.',
  //   'Cách thức đóng học phí 2024 chương trình Chất Lượng Cao.',
  //   'Tôi có thể tra cứu điểm và bảng điểm ở đâu?', 'Giới Thiệu về bộ môn Hệ Thống Thông Tin']

    return loading && recommendedQuestions == null? (
    <Box className = "recommend_page">
        <Skeleton variant="rounded" width={'50%'} height={60} sx = {{ borderRadius: '10px', mb: 1 }} />
        <Skeleton variant="rounded" width={'70%'} height={40} sx = {{ borderRadius: '10px', mb: 1 }} />

        <Box sx = {Container_Style} >
            { ['','',''].map((_data, index) => ( <Skeleton key={index*275486} variant="rounded" width={120} height={40} sx = {{ borderRadius: '10px', mb: 1 }} /> )) }
        </Box>

        <Box sx = {Container_Style} >
            { ['','',''].map((_data, index) => ( <Skeleton key={index*208752} variant="rounded" width={180} height={180} sx = {{ borderRadius: '10px', mb: 1 }} /> )) }
        </Box> 

        <Box sx ={{ width: '100%', height: 2 }}></Box>  
    </Box>
    ) : (
    <Box className = "recommend_page">

      { numPage == 0 && <Box>
        {!username ? <Skeleton variant="rounded" width={'70%'} height={40} sx = {{ borderRadius: '10px', mb: 1 }} /> 
          : <Typography variant='h2' sx = {{ 
              fontSize: { xs: '1.385rem', md: '2rem', xl: '2.8rem' },
              width: 'fit-content',
              paddingBottom: { xs: '0', md: 0.2 },
              fontWeight: '900',
              background: theme => theme.palette.mode != 'dark' ? 
              'linear-gradient(74deg, #4285f4 0, #9b72cb 9%, #4654b1 20%, #423397 24%, #9b72cb 35%, #4285f4 44%, #9b72cb 50%, #5089ad 56%, #131314 75%, #131314 100%)'
              : 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)',
              color: 'transparent',
              backgroundSize: '155% 100%',
              WebkitBackgroundClip : 'text',
              textAlign: 'start',
          }}>Xin Chào Bạn, {username}!</Typography> }

        <Typography variant='h3' sx = {{ 
            fontSize: { xs: '1.3rem', md: '1.5rem', xl: '2rem' },
            marginBottom: {xl: 2, md: 1, xs: 0.2},
            width: 'fit-content',
            textAlign:'left',
            color: theme => theme.palette.mode == 'dark' ? '#c0c0c0' : '#7b7c93',
            fontWeight: '900',
        }}>Tôi có thể giúp gì hôm nay ?</Typography>


        <Box sx = {{...Container_Style, gap: { xl: 3, md: 2, xs: 1 } }}>
        {recommendedQuestions && recommendedQuestions.map((question, index) => {
            return (
            <Box key = {index} sx = {{ 
                flex:  { xs: "0 1 140px", md: "0 1 160px", xl: "0 1 260px" },
                display: { sm: index >= 3 && 'none', xs: 'flex' }
            }}>
                <Box sx = {{ 
                height: { xs: "120px", md: "160px", xl: '260px' }, width: '100%', borderRadius: '10px',
                padding: 2, position: 'relative', textAlign: 'start', fontSize: { xl: '1.5rem' },
                ...BLOCK_STYLE }} onClick = {async () => { ChatAction && await ChatAction(question) }}>
                    {index + 1}{'. '}{question.question}
                <span style={{  position: 'absolute', bottom: '16px', right: '16px' }}> <TipsAndUpdatesOutlinedIcon/> </span>
                </Box>
            </Box>
            )
        })}
        </Box>
      </Box> }
    </Box>
  )
}

export default RecommendChatPage

const RECOMMENDATION_QUESTION = [
  ['Quy chế đào tạo cho trình độ đại học Trường Đại Học Khoa Học Tự Nhiên, Đại Học Quốc Gia TPHCM',
              'Bao nhiêu điểm thì sinh viên đạt học lực Giỏi, Khá, Trung Bình?', 
              'Các Tuyến Xe Buýt Lưu Thông Trong Đại Học Quốc Gia'
  ],
  ['Tôi có thể tra cứu điểm và bảng điểm ở đâu',
              'DSHV đăng ký đề tài luận văn Thạc sĩ khóa 31/2021',
              'Thông báo về việc cập nhật thông tin chuyên ngành sinh viên bậc Đại học hệ chính quy – Khóa 2020'],
  ['Lịch thi kết thúc học phần 2 các lớp cao học khóa 32/2022',
            'Thông báo cập nhật lịch học lớp Kỹ năng mềm HK3/2022-2023',
            'Đổi phòng lớp Xử lý phân tích dữ liệu trực tuyến 20_1 HK1/23-24'],
  ['Chương trình New Southbound Policy Elite Study Program - Đại Học Quốc lập Chung Hsing',
              'Chương trình học bổng của Ninety Eight 2024',
            'Thông tin học bổng MEXT 2023'],
  ['Điều kiện nhận học bổng là gì?',
            '[HCM] FPT SOFTWARE TUYỂN DỤNG 30 FRESHER JAVA/AEM',
            'Thông tin thực tập FPT Software'],
  ['Địa điểm tổ chức chương trình Hướng dẫn viết và trình bày báo cáo đề tài án tốt nghiệp 2024',
            'Sự Kiện NTU PEAK ASEAN năm 2024 bắt đầu khi nào ?',
            'Thông Tin Sự Kiện Hack A Day'],
]