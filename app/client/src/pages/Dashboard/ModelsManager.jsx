import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import UnknowPage from '../../components/Page/UnknowPage'
import { useOutletContext } from 'react-router-dom'
import Block from '~/components/Mui/Block'
import { Box, Typography, Button, TextField, Slider, Select, MenuItem, InputLabel, IconButton, FormControlLabel, Switch } from '@mui/material'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import Grid from '@mui/material/Grid2'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { getParams, postParams } from '~/apis/KHTN_Chatbot/params';
import { useSelector } from 'react-redux';
const TEXTFIELD_STYLE = {
  '--mui-palette-text-secondary': '#6d6d6d',
  '& .MuiInputBase-root':{
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

const TEXTFIELD_STYLE_2 = {
  '& input': {
    padding: '7.5px 14px'
  }
}

function ModelsManager() {

  const {processHandler, noticeHandler, dashboard, getModal } = useOutletContext()
  const token = useSelector(state => state.auth.token)
  const role = useSelector(state => state.auth.user?.role || state.auth.user?.educationRole)

  const [max_token_output, set_max_token_output] = useState(0)
  const [k_document, set_k_document] = useState(2)
  const [threshold, set_threshold] = useState(0)
  const [filter_bias, set_filter_bias] = useState(0)
  const [isHitoryInExtract, setHitoryInExtract] = useState(true)

  useEffect(() => {
    document.title = 'Chatbot - Trang Chủ'
    dashboard.navigate.active(242)

    token && role == 'administrator' && getParamsAPI()
      .then((data) => {
        set_max_token_output(data?.max_tokens)
        set_k_document(data?.k)
        set_threshold(data?.threshold)
        setHitoryInExtract(data?.use_history)
        set_filter_bias(data?.filter_bias)
      })

    return () => ( dashboard.navigate.active('#') )
  }, [token])


  const getParamsAPI = async () => {
    const getPramsEvent = processHandler.add('#getPrams')
    return getParams(token)
      .then((data) => { processHandler.remove('#getPrams', getPramsEvent); return data })
      .catch((err) => { 
        processHandler.remove('#getPrams', getPramsEvent)
        noticeHandler.add({
          status: 'error',
          message: 'Có Lỗi Xảy Ra Trong Quá Trình Xử Lý'
        }) 
        return err 
      })
  }

  const saveParamsAPI = async () => {
    const updateParamsEvent = processHandler.add('#updateParamsEvent')
    const res = await postParams(token, {
      'use_history': isHitoryInExtract,
      'max_tokens': max_token_output,
      'filter_bias': filter_bias,
      'threshold': threshold,
      'k': k_document,
    }).then(() => {
      processHandler.remove('#updateParamsEvent', updateParamsEvent)
      noticeHandler.add({
        status: 'success',
        message: 'Cập Nhật Dữ Liệu Thành Công'
      }) 
    }).catch(() => {
      processHandler.remove('#updateParamsEvent', updateParamsEvent)
      noticeHandler.add({
        status: 'error',
        message: 'Có Lỗi Xảy Ra Trong Quá Trình Xử Lý'
      }) 
    })
    console.log(res)
    return params
  }

  const marks = {
    'max_token': [  
    //   {
    //   value: 1200,
    //   label: 'Giá trị mặc định',
    // }
  ],
    'max_k': [  
    //   {
    //   value: 3,
    //   label: 'Giá trị mặc định',
    // }
  ],
    'threshold': [  
    //   {
    //   value: 0.25,
    //   label: 'Giá trị mặc định',
    // }
  ],
    'filter_bias': [  
    //   {
    //   value: 0.25,
    //   label: 'Giá trị mặc định',
    // }
  ]
  }

  const handleKeyDown = (event) => {
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9','.',
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter'
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  return role == 'administrator' ? (
    <Block sx = {{ paddingX: 2, paddingTop: 4, paddingRight: 2 }}>
      <Box sx ={{ paddingLeft: 2, paddingBottom: 1 }}>
        <Box sx = {{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 0.5 }}>
          <Typography variant='h1' 
            sx = {{ fontSize: '1.7rem', fontFamily: 'Roboto', fontWeight: '900', width: 'fit-content', color: theme => theme.palette.mode == 'dark' ? '#fff' : theme.palette.primary.main }}>
              Điều Chỉnh Thông Số Mô Hình</Typography>
          <Box  sx ={{ marginRight: 2 }}>
            <Button startIcon = {<SaveOutlinedIcon/>} component="label" role={undefined} tabIndex={-1}
              onClick = {saveParamsAPI}
              sx = {{ color: '#fff', background: theme=> theme.palette.primary.main ,paddingX:2,paddingY: 1,boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)',borderRadius: '10px' }} >
            Lưu thay đổi</Button>
          </Box>
        </Box>
        <Box sx = {{ display: 'flex', gap: 0.5, paddingTop: 0.5, paddingBottom: 2, color: theme => theme.palette.mode == 'dark'? '#fff' : '#727171',}}>
          <LightbulbOutlinedIcon sx = {{ color: 'inherit', fontSize: '24px' }}/>

          <Typography  variant='p' component='p' fontSize= {'0.925rem'} 
            sx = {{  fontWeight: '400', color: 'inherit', width: 'fit-content', textAlign: 'start', maxWidth: '705px', textAlign: 'justify' }}>
            {' '} Cho phép tinh chỉnh các thông số cốt lõi của mô hình AI, nhằm tối ưu hóa hiệu suất, độ chính xác cũng như khả năng phản hồi theo yêu cầu cụ thể của bài toán. Việc này giúp kiểm soát quá trình suy luận, cải thiện chất lượng đầu ra và đảm bảo mô hình hoạt động hiệu quả trong các tình huống khác nhau.</Typography>
        </Box>
      </Box>

      <Box sx = {{ height: 'calc(100% - 155px)', background: '#ffffff', overflow: 'auto', borderRadius: '10px', padding: 1 }}>
        <Grid container spacing={2} direction="row" sx={{ height: 'calc(100vh - 280px)', justifyContent: "center", alignItems: "center" }}>
          
          <Grid size={3.5}>
            <Box sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx = {{ width: '100px', height: '100px', background: 'red', borderRadius: '50%' }}></Box>
              <Typography sx = {{ fontSize: '12px !important', width: '60%', color: '#616161', paddingTop: 1 }}>Ảnh đại diện của trợ lý AI phải là ảnh JPG, PNG, JPEG và có kích thước nhỏ hơn 5MB.</Typography>
              <Button startIcon={<CloudUploadOutlinedIcon/>}
              onClick={() => noticeHandler.add({
                status: 'warning',
                message: 'Tính Năng Này Chưa Được Hỗ Trợ'
              }) }
              >Thay đổi hình ảnh</Button>
            </Box>
          </Grid>

          <Grid size={8.5}>
            <Box sx = {{ height: 'calc(100vh - 250px)', overflow: 'auto', display: 'flex', flexDirection: 'column', paddingTop: 1.4, paddingRight: 1, gap: 1.8 }}>
              
              <Typography variant='h6' sx = {{ textAlign: 'start' }}>Thông Tin Trợ Lý Ảo</Typography>
              <Box sx = {{ display: 'flex', gap: 2 }}>
                <TextField sx = {TEXTFIELD_STYLE} fullWidth label="Tên Trợ Lý Ảo" id="assistant_name" value={"Trợ Lý Ảo FIT_HCMUS"} disabled/>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Tên Mô Hình AI"
                  value={'ChatGPT'} sx = {TEXTFIELD_STYLE} disabled
                >
                  <MenuItem value="ChatGPT">
                    <em>Mô hình ChatGPT</em>
                  </MenuItem>
                </Select>
              </Box>
              <TextField sx = {TEXTFIELD_STYLE} fullWidth multiline rows={3} id="description" label="Ghi Ý - Prompt" disabled
                value={`Hệ thống được cập nhật lần cuối vào ngày 9/3/2025. Bạn cần trả lời ngắn gọn và tập trung vào trọng điểm chính. Nếu bạn không chắc chắn về câu trả lời, hãy thừa nhận và không cố gắn giả định câu trả lời.`}/>
              
              <Typography variant='h6' sx = {{ textAlign: 'start' }}>Tham số mô hình ngôn ngữ lớn</Typography>

              <Box sx = {{ display: 'flex', alignItems: 'center', justifyContent:'center', paddingRight: 4, gap: 2 }}>
                <IconButton onClick={() => getModal('Tham số Max_Token_Output', <Box>
                  Đây là tham số điều chỉnh số lượng token tối đa có thể tạo ra trong một lần phản hồi.{<br/>}
                  🔹Số token càng lớn, câu trả lời càng chứa nhiều thông tin 👉 Chi phí lớn{<br/>}
                  🔹Số token càng nhỏ, nội dung câu trả lời ngắn gọn hơn 👉 Nội dung không đầy đủ {<br/>}
                  Quản lý giới hạn này giúp tối ưu hóa hiệu suất của mô hình. 
                </Box>)}>
                  <InfoOutlinedIcon sx ={{color: '#000'}}/>
                </IconButton>
                <Typography sx= {{ width: '180px', textAlign:'start' }}>Số Token Output </Typography>
                <Slider sx = {{...TEXTFIELD_STYLE}} onChange={(e) => set_max_token_output(e.target.value)} value = {max_token_output} defaultValue={1000} getAriaValueText={(value) => `${value} tokens`} step={50} marks = {marks.max_token} min={750} max={2400} valueLabelDisplay="auto"/>
                <TextField id="max_token_text" variant="outlined" sx = {{ width: '120px', ...TEXTFIELD_STYLE_2 }}
                  value={max_token_output}
                  onKeyDown={handleKeyDown}
                  onBlur={(e) => {
                    const numValue = parseInt(e.target.value, 10);
                    if(numValue < 750) { set_max_token_output(750); return}
                    if(numValue > 2400) { set_max_token_output(2400); return}

                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') { set_max_token_output(''); return }
                    set_max_token_output(inputValue)
                  }}
                />
              </Box>

              <Typography variant='h6' sx = {{ textAlign: 'start' }}>Tham số mô hình Phobert</Typography>

              <Box sx = {{ display: 'flex', alignItems: 'center', paddingRight: 4, gap: 2 }}>
                <IconButton onClick={() => getModal('Tham số Threshold', <Box>
                  Đây là tham số ngưỡng chấp nhận dự đoán của mô hình Phobert. Dự đoán của mô hình phải {'>='} để kết quả được chấp nhận .{<br/>}
                  🔹Kết quả {'>='} Threshold 👉 Dự đoán của mô hình có thể tin tưởng{<br/>}
                  🔹Kết quả {'<'} Threshold, 👉 Dự đoán của mô hình không thể tin tưởng {<br/>}
                  Quản lý giới hạn này giúp tối ưu hóa xác định chủ đề câu hỏi. 
                </Box>)}>
                  <InfoOutlinedIcon sx ={{color: '#000'}}/>
                </IconButton>
                <Typography sx= {{ width: '320px', textAlign:'start' }}>Ngưỡng chấp nhận cho phép dự đoán chủ đề</Typography>
                <Slider  sx = {{...TEXTFIELD_STYLE}} onChange={(e) => set_threshold(e.target.value)} value={threshold} defaultValue={0.5} marks = {marks.filter_bias} step={0.01} min={0} max={1} valueLabelDisplay="auto"/>
                <TextField id="max_token_text" variant="outlined"  sx = {{  width: '120px', ...TEXTFIELD_STYLE_2 }}            
                  value={threshold}
                  onKeyDown={handleKeyDown}
                  onBlur={(e) => {
                    const numValue = Math.round(parseFloat(e.target.value) * 100) / 100;
                    if(numValue < 0) { set_threshold(0); return}
                    if(numValue > 1) { set_threshold(1); return}

                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') { set_threshold(''); return }
                    set_threshold(inputValue)
                  }}
                />
              </Box>

              <FormControlLabel
                
                control={<IOSSwitch sx={{ m: 1 }} 
                  checked={isHitoryInExtract}
                  onChange={() => setHitoryInExtract(prev => !prev)} />}
                label="Cho Phép Sử Dụng Lịch Sử Trong Dự Đoán Hội Thoại"
              />

              <Typography variant='h6' sx = {{ textAlign: 'start' }}>Tham số quá trình tìm kiếm</Typography>

              <Box sx = {{ display: 'flex', alignItems: 'center', paddingRight: 4, gap: 2 }}>
                <IconButton onClick={() => getModal('Tham số K_Document', <Box>
                  Đây là tham số điều chỉnh số lượng tài liệu tương đồng được tìm thấy trong kho dữ liệu có thể tạo ra trong một lần phản hồi.{<br/>}
                  🔹Càng nhiều tài liệu chứa nhiều thông tin 👉 Chi phí lớn và gây ảo giác{<br/>}
                  🔹Số tài liệu tìm ra ít 👉 Không bao quát nội dung câu hỏi người dùng {<br/>}
                  Quản lý giới hạn này giúp tối ưu hóa nội dung câu trả lời cho người dùng cuối. 
                </Box>)}>
                  <InfoOutlinedIcon sx ={{color: '#000'}}/>
                </IconButton>
                <Typography sx= {{ width: '320px', textAlign:'start' }}>Số tài liệu/lượt trò chuyện</Typography>
                <Slider  sx = {{...TEXTFIELD_STYLE}} onChange={(e) => set_k_document(e.target.value)} value={k_document} defaultValue={3} step={1}  marks = {marks.max_k} min={1} max={10} valueLabelDisplay="auto"/>
                <TextField id="max_token_text" variant="outlined" sx = {{  width: '120px', ...TEXTFIELD_STYLE_2 }} 
                  onKeyDown={handleKeyDown}
                  value={k_document} 
                  onBlur={(e) => {
                    const numValue = parseInt(e.target.value, 10);
                    if(numValue < 1) { set_k_document(1); return}
                    if(numValue > 10) { set_k_document(10); return}
                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') { set_k_document(''); return }
                    set_k_document(inputValue)
                  }}
                />
              </Box>

              <Box sx = {{ display: 'flex', alignItems: 'center', paddingRight: 4, gap: 2 }}>
                <IconButton onClick={() => getModal('Tham số Filter_Bias', <Box>
                  Đây là tham số xác định độ ưu tiên với metadata - Mức độ strict matching.{<br/>}
                  🔹Tham số là 0 👉 Độ ưu tiên cao nhất{<br/>}
                  🔹Tham số là 1 👉 Độ ưu tiên thấp nhất {<br/>}
                  Quản lý giới hạn này giúp tối ưu hóa hiệu suất của mô hình. 
                </Box>)}>
                  <InfoOutlinedIcon sx ={{color: '#000'}}/>
                </IconButton>
                <Typography sx= {{ width: '320px', textAlign:'start' }}>Mức độ strict matching</Typography>
                <Slider  sx = {{...TEXTFIELD_STYLE}}  onChange={(e) => set_filter_bias(e.target.value)}  value={filter_bias} defaultValue={0.5} marks = {marks.filter_bias} step={0.01} min={0} max={1} valueLabelDisplay="auto"/>
                <TextField id="max_token_text" variant="outlined" sx = {{  width: '120px', ...TEXTFIELD_STYLE_2 }} 
                  value={filter_bias}
                  onKeyDown={handleKeyDown}
                  onBlur={(e) => {
                    const numValue = Math.round(parseFloat(e.target.value) * 100) / 100;
                    if(numValue < 0) { set_filter_bias(0); return}
                    if(numValue > 1) { set_filter_bias(1); return}

                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') { set_filter_bias(''); return }
                    set_filter_bias(inputValue)
                  }}
                />
              </Box>

              <Box sx = {{ paddingBottom: 2 }}></Box>

            </Box>
          </Grid>
        </Grid>
      </Box>


    </Block>
  ) : <UnknowPage/>
}

export default ModelsManager


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));
