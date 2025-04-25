import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { navigate as sidebarAction } from '~/store/actions/navigateActions';
import Grid from '@mui/material/Grid2'
import { Box, Button, Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '~/apis/Auth';

function FeedBack() {
  const { mainLayout } = useOutletContext();
  const token = useSelector(state => state.auth.token)
  
  useEffect(() => {
    document.title = 'Chatbot - Phản Hồi'
    mainLayout.navigate(123)
  }, [])
  const { processHandler, noticeHandler } = useOutletContext();

  const submit = (message) => {
    const sendFeedbackEvent = processHandler.add('#sendFeedback')
    useAuth.feedback(token, {message}).then(() => {
      noticeHandler.add({
        status: 'success',
        message: 'Phản hồi của bạn được ghi nhận, Xin cảm ơn !'
      })
      setValue(null)
    }).catch((error) => {  
      noticeHandler.add({
        status: 'error',
        message: error//'Phản Hồi Thất Bại !'
      })
    })
    .finally(() => processHandler.remove('#sendFeedback', sendFeedbackEvent))

  }
  const [value, setValue] = useState(null)
  return (
    <Box sx = {{ width: '100%', height: '100%', paddingY: { xs : 6, md: 3, xl: 8 }, paddingX: 3 }}>
      <Grid container  spacing={2} sx = {{ height: '100%' }}>


        <Grid  offset={{ xs: 0, md: 3 }} size={{ xs: 12, md: 6 }}>
          <Typography variant = 'h1' sx = {{ 
            fontSize: { xs: '2rem !important', xl: '3rem !important' },
            fontWeight: '800',
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            background: theme => theme.palette.mode == 'dark' ? 'linear-gradient(78deg, #7cff60 4%, color-mix(in oklch, #8bffcc, #00f50f) 22%, #f3ff00 45%, color-mix(in oklch, #efff34, #daf24f) 67%, #f4ff12 100.2%)'
              : 'linear-gradient(90deg, #463aa2 4%, color-mix(in oklch, #382e82, #0061cf) 22%, #047aff 45%, color-mix(in oklch, #047aff, #c148ac) 67%, #c148ac 100.2%)',
            color: 'transparent', backgroundSize: '100% 100%', WebkitBackgroundClip : 'text', width: '100%', textAlign: 'center', marginBottom: { xs: 1, xl: 2 }
            }}>
            Báo lỗi / Góp ý </Typography>
          <Typography variant = 'h1' sx = {{ 
            fontSize: { xs: '1rem' , xl: '1.425rem' }, lineHeight: { xs: '25px', xl: '40px'},
            fontWeight: '500', color: theme => theme.palette.mode == 'dark' ? '#d2d2ff': '#0b1e8a',
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            }}>
            Sự đóng góp ý kiến từ các bạn sẽ là sự hỗ trợ đắc lực giúp chúng tôi ngày càng tốt hoàn thiện sản phẩm hơn.</Typography>

            <textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="Nhập phản hồi của bạn tại đây!" className="mt-5 mb-3 h-[30%] textarea textarea-bordered textarea-md w-full " style={{ height: '164px', padding: '15px', borderRadius: '10px', background: '#fff', color: '#000'}}></textarea>

          <Button onClick={() => submit(value)} variant='contained' sx = {{ fontSize: {xl: '1.475rem'}, paddingY: '8px' , background: theme => theme.palette.primary.main, borderRadius: '10px' }} fullWidth>Gửi Ý Kiến</Button>
        </Grid>


      </Grid>

    </Box>
  )
}

export default FeedBack