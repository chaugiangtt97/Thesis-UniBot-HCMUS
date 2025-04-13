import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { navigate as sidebarAction } from '~/store/actions/navigateActions';
import Grid from '@mui/material/Grid2'
import { Box, Typography } from '@mui/material';
import AccordionUsage from '~/components/Mui/AccordionUsage';
import { useOutletContext } from 'react-router-dom';

function FAQs() {
  
   const { mainLayout } = useOutletContext();

  useEffect(() => {
    document.title = 'Chatbot - FAQs';
    mainLayout.navigate(122)
  })

  const fags = [
    {
        id : 'panel1',
        summary: 'Chatbot hoạt động như thế nào?',
        detail: 'Chatbot hoạt động bằng cách từ câu hỏi của người dùng, sử dụng kỹ thuật tìm văn bản liên quan đến câu hỏi trong bộ dữ liệu đã được vector hóa (text similarity) và lưu trữ thông qua vector database. Giúp lấy ra những đoạn văn bản có liên quan sau đó dùng mô hình ngôn ngữ lớn (LLM) để sinh câu trả lời.'
    },
    {
        id : 'panel2',
        summary: 'Cách sử dụng chatbot để tra cứu thông tin',
        detail: 'Để sử dụng chatbot một cách hiệu quả nhất bạn nên đặt câu hỏi một cách rõ ràng đầy đủ để mô hình có thể đưa ra câu trả lời chính xác. Tuy nhiên, ở một số trường hợp câu trả lời có thể không chính xác nên bạn phải kiểm chứng thông tin hoặc liên hệ hỗ trợ nếu cần thiết nhé.'
    },
    {
        id : 'panel3',
        summary: 'Thông tin từ chatbot có đáng tin cậy không?',
        detail: 'Vì là một mô hình xác xuất nên thông tin chatbot đưa ra có thể không chính xác ở một số trường hợp, bạn nên kiểm chứng thông tin hoặc liên hệ hỗ trợ nếu cần thiết nhé'
    },
    {
        id : 'panel4',
        summary: 'Tôi có thể liên hệ hỗ trợ như thế nào?',
        detail: 'Vào phần Góp ý/báo lỗi hoặc phòng công tác sinh viên của trường.'
    }
  ]
  return (
    <Box sx = {{ width: '100%', height: '100%', paddingY: { xs : 6, md: 3 }, paddingX: 3 }}>
      <Grid container  spacing={2} sx = {{ height: '100%' }}>
        <Grid  offset={{ xs: 0, md: 3 }} size={{ xs: 12, md: 6 }}>
          <Typography variant = 'h1' sx = {{ 
            fontSize: '2rem',
            fontWeight: '800',
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            background: theme => theme.palette.mode == 'dark' ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
              : 'linear-gradient(90deg, #463aa2 4%, color-mix(in oklch, #382e82, #0061cf) 22%, #047aff 45%, color-mix(in oklch, #047aff, #c148ac) 67%, #c148ac 100.2%)',
            color: 'transparent', backgroundSize: '100% 100%', WebkitBackgroundClip : 'text', width: '100%', textAlign: 'center', marginBottom: 2
            }}>
            Những câu hỏi thường gặp (FAQs) </Typography>

            <AccordionUsage data = {fags}/>
        </Grid>


      </Grid>

    </Box>
  )
}

export default FAQs