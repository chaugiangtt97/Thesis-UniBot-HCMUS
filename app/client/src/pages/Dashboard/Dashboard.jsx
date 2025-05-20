import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Block as CustomBlock } from '~/components/Mui/Block';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Grid from '@mui/material/Grid2';
import StarIcon from '@mui/icons-material/Star';

export function Dashboard() {
  const {processHandler, dashboard, noticeHandler } = useOutletContext();
  const token = useSelector(state => state.auth.token)

  const [dataChatGPT, setDataChatGPT] = useState([])

  useEffect(() => {
    document.title = 'Chatbot - Trang Chủ';
    dashboard.navigate.active(234)
    
    return () => (
      dashboard.navigate.active('#')
    )
  }, [])

  useEffect(() => {
    const dataChatGPT_format = (data) => {
      let totalInputTokens = 0
      let totalOutputTokens = 0
      let totalInputCachedTokens = 0
      let totalNumModelRequests = 0
      let totalTokenInDate = []
      let dateLabel = []
      let inputTokens = []
      let outputTokens = []
      let inputCachedTokens = []
      let numModelRequests = []

      data['data'].forEach(bucket => {
          dateLabel.push(formatTime_Date_Month(bucket.start_time))
          if(bucket['results'].length == 0) {
            inputTokens.push(0)
            outputTokens.push(0)
            inputCachedTokens.push(0)
            numModelRequests.push(0)
            totalTokenInDate.push(0)
            return
          }
          bucket.results.forEach(result => {
              totalInputTokens += result.input_tokens
              totalOutputTokens += result.output_tokens
              totalInputCachedTokens += result.input_cached_tokens
              totalNumModelRequests += result.num_model_requests

              inputTokens.push(result.input_tokens)
              outputTokens.push(result.output_tokens)
              inputCachedTokens.push(result.input_cached_tokens)
              numModelRequests.push(result.num_model_requests)
              totalTokenInDate.push(totalInputTokens + totalOutputTokens + totalInputCachedTokens + totalNumModelRequests)
          })
      })

      return {
        data: data['data'].map((data) => ({...data, ...data['results'][0]})),
        total_input_request_tokens: totalInputTokens,
        total_output_request_tokens: totalOutputTokens,
        total_cached_request_tokens: totalInputCachedTokens,
        total_requests: totalNumModelRequests,
        dateLabel, inputTokens, outputTokens, inputCachedTokens, numModelRequests, totalTokenInDate
      }
    }
    const getGPTData = async () => {
      // const ChatGPT_Event = processHandler.add('#chatgpt')
      let chatGPTDataResponse = {
        data: [],
        has_more: true,
        next_page: null
      }

      try {
        while(chatGPTDataResponse.has_more) {
          await usageCompletion(chatGPTDataResponse.next_page)
          .then((data) => {
            chatGPTDataResponse = { data : [...chatGPTDataResponse.data, ...data['data'] ], has_more: data['has_more'], next_page: data['next_page']}
            setDataChatGPT(dataChatGPT_format(chatGPTDataResponse))
          })
          .catch((e) => {
            console.log(e)
            chatGPTDataResponse = {...chatGPTDataResponse, has_more: false}
            throw e
          })
        }
      } catch (error) {
        console.log('catch lỗi : ',error)
        noticeHandler.add({
          status: 'error',
          message: 'Lấy Dữ Liệu ChatGPT không thành công'
        })
        return null
      }
      // processHandler.remove('#chatgpt', ChatGPT_Event)
      return chatGPTDataResponse
    }

    getGPTData()
    // .then((data) => {
    //   if(data) {
    //     setDataChatGPT(() => {
    //       let totalInputTokens = 0
    //       let totalOutputTokens = 0
    //       let totalInputCachedTokens = 0
    //       let totalNumModelRequests = 0
    //       let totalTokenInDate = []
    //       let dateLabel = []
    //       let inputTokens = []
    //       let outputTokens = []
    //       let inputCachedTokens = []
    //       let numModelRequests = []
    
    //       data['data'].forEach(bucket => {
    //           dateLabel.push(formatTime_Date_Month(bucket.start_time))
    //           if(bucket['results'].length == 0) {
    //             inputTokens.push(0)
    //             outputTokens.push(0)
    //             inputCachedTokens.push(0)
    //             numModelRequests.push(0)
    //             totalTokenInDate.push(0)
    //             return
    //           }
    //           bucket.results.forEach(result => {
    //               totalInputTokens += result.input_tokens
    //               totalOutputTokens += result.output_tokens
    //               totalInputCachedTokens += result.input_cached_tokens
    //               totalNumModelRequests += result.num_model_requests
    
    //               inputTokens.push(result.input_tokens)
    //               outputTokens.push(result.output_tokens)
    //               inputCachedTokens.push(result.input_cached_tokens)
    //               numModelRequests.push(result.num_model_requests)
    //               totalTokenInDate.push(totalInputTokens + totalOutputTokens + totalInputCachedTokens + totalNumModelRequests)
    //           })
    //       })

    //       return {
    //         data: data['data'].map((data) => ({...data, ...data['results'][0]})),
    //         total_input_request_tokens: totalInputTokens,
    //         total_output_request_tokens: totalOutputTokens,
    //         total_cached_request_tokens: totalInputCachedTokens,
    //         total_requests: totalNumModelRequests,
    //         dateLabel, inputTokens, outputTokens, inputCachedTokens, numModelRequests, totalTokenInDate
    //       }
    //     })
    //   }
    // })

  }, [token])


  const ChatGPTStatic = {
    series: [{
      data: dataChatGPT?.totalTokenInDate || [],//[0, 2713 + 888, 0, 13919+4950+1152, 3681+487, 9805+4185, 27134+7508+2048, 16832+3709, 7918+1272, 17833+2499, 19197+1950],
      label: 'Số token được sử dụng trong ngày',
      yAxisId: 'leftAxisId'
    },
    {
      data: dataChatGPT?.numModelRequests || [], //[0, 8, 0, 30, 4, 19, 48, 15, 11, 17, 26],
      label: 'Số lượt sử dụng model trong ngày',
      yAxisId: 'rightAxisId'
    }],
    yAxis: [{ id: 'leftAxisId' }, { id: 'rightAxisId' }],
    rightAxis: "rightAxisId",
    xAxis: [{ scaleType: 'point', data : dataChatGPT?.dateLabel || ['không có dữ liệu']
  }]
  }

  const CTDT_PieChart = {
    series: [
      {
        outerRadius: 80,
        data: [
          { label: 'Hệ Thống Thông Tin', value: 34, color: '#1E3A8A' },
          { label: 'Khoa Học Máy Tính', value: 14, color: '#3B82F6' },
          { label: 'Mạng Máy Tính', value: 0, color: '#60A5FA' },
          { label: 'Kỹ Thuật Phần Mềm', value: 0, color: '#93C5FD' },
          { label: 'Thị Giác Máy Tính', value: 0, color: '#D1E7FF' },
          { label: 'Công Nghệ Thông Tin', value: 477, color: '#B0B0B0' }
        ],
        highlightScope: { fade: 'global', highlight: 'item' },
        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        arcLabel: (params) => {
          const data = [
            { label: 'Hệ Thống Thông Tin', value: 34, color: '#1E3A8A' },
            { label: 'Khoa Học Máy Tính', value: 14, color: '#3B82F6' },
            { label: 'Mạng Máy Tính', value: 0, color: '#60A5FA' },
            { label: 'Kỹ Thuật Phần Mềm', value: 0, color: '#93C5FD' },
            { label: 'Thị Giác Máy Tính', value: 0, color: '#D1E7FF' },
            { label: 'Công Nghệ Thông Tin', value: 477, color: '#B0B0B0' }
          ]
          const percent = params.value / data.map((item) => item.value).reduce((a, b) => a + b, 0);;
          if(percent * 100 < 10) return '' 
          return `${(percent * 100).toFixed(0)}%`;
        }
      },
    ]
  }

  const KDT_PieChart = {
    series: [
      {
        outerRadius: 80,
        data: [
          { label: 'K20', value: 43, color: '#1E3A8A' },
          { label: 'K21', value: 5, color: '#3B82F6' },
          { label: 'K22', value: 0, color: '#60A5FA' },
          { label: 'K23', value: 0, color: '#93C5FD' },
          { label: 'K24', value: 0, color: '#D1E7FF' },
          { label: 'Không Có Thông Tin', value: 447, color: '#B0B0B0' }
        ],
        highlightScope: { fade: 'global', highlight: 'item' },
        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        arcLabel: (params) => {
          const data = [
            { label: 'K20', value: 43, color: '#1E3A8A' },
            { label: 'K21', value: 5, color: '#3B82F6' },
            { label: 'K22', value: 0, color: '#60A5FA' },
            { label: 'K23', value: 0, color: '#93C5FD' },
            { label: 'K24', value: 0, color: '#D1E7FF' },
            { label: 'Không Có Thông Tin', value: 447, color: '#B0B0B0' }
          ]
          const percent = params.value / data.map((item) => item.value).reduce((a, b) => a + b, 0);;
          if(percent * 100 < 15) return '' 
          return `${(percent * 100).toFixed(0)}%`;
        }
      },
    ]
  }

  const GT_PieChart = {
    series: [
      {
        outerRadius: 80,
        data: [
          { label: 'Nam', value: 140, color: '#1E3A8A' },
          { label: 'Nữ', value: 0, color: '#3B82F6' },
          { label: 'Không có thông tin', value: 385, color: '#B0B0B0' },
        ],
        highlightScope: { fade: 'global', highlight: 'item' },
        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        arcLabel: (params) => {
          const data = [
            { label: 'Nam', value: 140, color: '#1E3A8A' },
            { label: 'Nữ', value: 0, color: '#3B82F6' },
            { label: 'Không có thông tin', value: 385, color: '#B0B0B0' },
          ]
          const percent = params.value / data.map((item) => item.value).reduce((a, b) => a + b, 0);;
          if(percent * 100 < 10) return '' 
          return `${(percent * 100).toFixed(0)}%`;
        }
      },
    ]
  }

  return (
    // <Hidden></Hidden>
    <CustomBlock sx ={{ width: '100%', boxShadow: 'none', border: 'none', background: 'transparent', overflowX: 'hidden'}}>

      <Box sx = {{ display: 'flex', gap: 1, alignItems:'center', paddingBottom: 2 }}>
        <DashboardIcon fontSize='large' sx = {{ color: theme => theme.palette.mode == 'dark' ? '#fff' : theme.palette.primary.main }}/>
        <Typography variant='h1' sx = {{ userSelect: 'none', '&:hover': { cursor: 'pointer' }, fontSize: '2rem', fontFamily: 'Roboto', fontWeight: '900', width: 'fit-content', color: theme => theme.palette.mode == 'dark' ? '#fff' : theme.palette.primary.main }}>
          Dashboard </Typography>
      </Box>

      <Grid container spacing={2} direction="row"
        sx={{ justifyContent: "center", alignItems: "start" }}>
        {/* block 1 */}
        <Grid size={7}>
          <Box sx = {{ position: 'relative', background: theme => theme.palette.mode == 'dark' ? '#4c5486f2' : '#005181', borderRadius: '10px', height: '310px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', width: '100%'}}>
            <Box sx = {{ display: 'flex', gap: 1, justifyContent: 'space-between', borderRadius: '10px 10px 0 0' }}>
              <Box sx = {{ '& > div': { width: '100%', display: 'flex', justifyContent: 'center' }, flex: '1 1 100%', height: '270px', background: '#eaf5ff', borderRadius: '10px 10px 0 0', paddingTop: 2 }}>
                <Typography variant = 'h6' color= '#000'>Hệ thống hỏi đáp dữ liệu nội bộ</Typography>
                <BasicLineChart/>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid size={5}>
          <Grid container spacing={2} direction="column">
            {/* block 2 */}
            <Grid size={12}>
              <Box sx = {{ position: 'relative', background: '#eaf5ff', borderRadius: '10px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', 
                height: '150px', width: '100%'}}>
                <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
                  <Typography variant = 'h6' color= '#000'>Số chủ đề trong hệ thống</Typography>
                </Box>
                <Box sx = {{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingX: 2  }}>
                  <Box>
                    <Typography variant='h5' sx = {{ color: '#000' }}>6</Typography>
                    <Typography variant='body1' sx = {{ color: '#000' }}>Chủ Đề ( Mặc Định )</Typography>
                  </Box>
                  <Box sx = {{ width: '2px', height: '70px', background: '#5d5d5d6b' }}></Box>
                  <Box>
                    <Typography variant='h5' sx = {{ color: '#000' }}>0</Typography>
                    <Typography variant='body1' sx = {{ color: '#000' }}>Chủ Đề ( Tạo Mới )</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box sx = {{ position: 'relative', background: '#eaf5ff', borderRadius: '10px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', 
                height: '150px', width: '100%'}}>
                <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
                  <Typography variant = 'h6' color= '#000'>Số tài liệu trong hệ thống</Typography>
                </Box>
                <Box sx = {{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingX: 2  }}>
                  <Box>
                    <Typography variant='h5' sx = {{ color: '#000' }}>778</Typography>
                    <Typography variant='body1' sx = {{ color: '#000' }}>Tài Liệu ( Mặc Định )</Typography>
                  </Box>
                  <Box sx = {{ width: '2px', height: '70px', background: '#5d5d5d6b' }}></Box>
                  <Box>
                    <Typography variant='h5' sx = {{ color: '#000' }}>4</Typography>
                    <Typography variant='body1' sx = {{ color: '#000' }}>Tài Liệu ( Được Tải Lên )</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={8}>
          <Box sx={{ height: '280px',  width: '100%', background: theme => theme.palette.mode == 'dark' ? '#041d34' : '#eaf5ff', borderRadius: '10px' }}>
            <MuiTable useData = {useData(dataChatGPT.data)}/>
          </Box>
        </Grid>

        <Grid size={4}>
          <Box sx = {{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', height: '280px', width: 'fit-content', maxWidth: '100%' }}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1, display: 'flex', justifyContent: 'center', gap: 0.5}}>
              <StarIcon sx ={{ color: '#b0841e', fontSize: '30px' }}/>
              <Typography variant = 'h6' color= '#000'>Đánh Giá Trò Chuyện </Typography>
            </Box>
            <PieChartWithCustomizedLabel/>
          </Box>
        </Grid>

        <Grid size={3}>
          <Box sx = {{ position: 'relative', background: '#eaf5ff', borderRadius: '10px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', 
              height: '120px', width: '100%'}}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
              <Box sx = {{ paddingTop: 0, paddingBottom: 0 }}>
                <Typography variant = 'h6' color= '#000'>Tokens Yêu Cầu</Typography>
              </Box>
              <Box>
                <Typography variant='h5' sx = {{ color: '#000' }}>{dataChatGPT.total_input_request_tokens}</Typography>
                <Typography variant='body1' sx = {{ color: '#000' }}>Tokens ( Input )</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={3}>
          <Box sx = {{ position: 'relative', background: '#eaf5ff', borderRadius: '10px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', 
              height: '120px', width: '100%'}}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
              <Box sx = {{ paddingTop: 0, paddingBottom: 0 }}>
                <Typography variant = 'h6' color= '#000'>Tokens Phản Hồi</Typography>
              </Box>
              <Box>
                <Typography variant='h5' sx = {{ color: '#000' }}>{dataChatGPT.total_output_request_tokens}</Typography>
                <Typography variant='body1' sx = {{ color: '#000' }}>Tokens ( Output )</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={3}>
          <Box sx = {{ position: 'relative', background: '#eaf5ff', borderRadius: '10px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', 
              height: '120px', width: '100%'}}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
              <Box sx = {{ paddingTop: 0, paddingBottom: 0 }}>
                <Typography variant = 'h6' color= '#000'>Tokens Lưu Trữ</Typography>
              </Box>
              <Box>
                <Typography variant='h5' sx = {{ color: '#000' }}>{dataChatGPT.total_cached_request_tokens}</Typography>
                <Typography variant='body1' sx = {{ color: '#000' }}>Tokens ( Cached )</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={3}>
          <Box sx = {{ position: 'relative', background: '#eaf5ff', borderRadius: '10px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', 
              height: '120px', width: '100%'}}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
              <Box sx = {{ paddingTop: 0, paddingBottom: 0 }}>
                <Typography variant = 'h6' color= '#000'>Tổng Số Requests</Typography>
              </Box>
              <Box>
                <Typography variant='h5' sx = {{ color: '#000' }}>{dataChatGPT.total_requests}</Typography>
                <Typography variant='body1' sx = {{ color: '#000' }}>Lượt Truy Cập</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={12}>
          <Box sx = {{ '&>div': { width: '100%', display: 'flex', justifyContent: 'center' }, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', height: 'auto', width: '100%', paddingTop: 2 }}>
            <Typography variant = 'h6' color= '#000'>Tổng Số Tokens Được Sử Dụng</Typography>
            <BasicLineChart width={900} height = {300} data = {ChatGPTStatic}/>
          </Box>
        </Grid>



        <Grid size={4}>
          <Box sx = {{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', height: '280px', width: 'fit-content', maxWidth: '100%' }}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
              <Typography variant = 'h6' color= '#000'>Trò chuyện theo c.t đào tạo</Typography>
            </Box>
            <PieChartWithCustomizedLabel data = {CTDT_PieChart}/>
          </Box>
        </Grid>

        <Grid size={4}>
          <Box sx = {{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', height: '280px', width: 'fit-content', maxWidth: '100%' }}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
              <Typography variant = 'h6' color= '#000'>Trò chuyện theo khóa đào tạo</Typography>
            </Box>
            <PieChartWithCustomizedLabel data = {KDT_PieChart}/>
          </Box>
        </Grid>

        <Grid size={4}>
          <Box sx = {{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', height: '280px', width: 'fit-content', maxWidth: '100%' }}>
            <Box sx = {{ paddingTop: 2, paddingBottom: 1 }}>
              <Typography variant = 'h6' color= '#000'>Trò chuyện theo giới tính</Typography>
            </Box>
            <PieChartWithCustomizedLabel data = {GT_PieChart}/>
          </Box>
        </Grid>

        <Grid size={4.5} offset={0}>
          <Box sx = {{ paddingY: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', height: '100%', width: '100%', maxWidth: '100%' }}>
            <Box sx = {{ paddingBottom: 1, paddingX: 2 }}>
              <Typography variant = 'h6' color= '#000' sx = {{ fontSize: '1rem', paddingBottom: 1 }}>Chủ đề nổi bật nhất</Typography>
              <Box sx = {{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx= {{ textAlign: 'start' }} variant = 'body1' color= '#000'>1. Nội Quy Trường Học</Typography>
                <Box sx = {{ display: 'flex', alignItems: 'center' }}>
                  <GroupOutlinedIcon sx = {{ color: 'green', fontSize: '20px', marginRight: 1 }}/>
                  <Typography sx= {{ textAlign: 'start' }} variant = 'body1' color= 'green'>3450 lượt truy cập</Typography>
                </Box>
              </Box>
              <Box sx = {{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx= {{ textAlign: 'start' }} variant = 'body1' color= '#000'>2. Thông Tin Học Bổng</Typography>
                <Box sx = {{ display: 'flex', alignItems: 'center' }}>
                  <GroupOutlinedIcon sx = {{ color: 'green', fontSize: '20px', marginRight: 1 }}/>
                  <Typography sx= {{ textAlign: 'start' }} variant = 'body1' color= 'green'>3450 lượt truy cập</Typography>
                </Box>
              </Box>
              <Box sx = {{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx= {{ textAlign: 'start' }} variant = 'body1' color= '#000'>3. Thông Báo Giáo Vụ</Typography>
                <Box sx = {{ display: 'flex', alignItems: 'center' }}>
                  <GroupOutlinedIcon sx = {{ color: 'green', fontSize: '20px', marginRight: 1 }}/>
                  <Typography sx= {{ textAlign: 'start' }} variant = 'body1' color= 'green'>3450 lượt truy cập</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={3.75} offset={0} sx= {{ alignItems: 'start' }}>
          <Box sx = {{ padding: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', width: '100%', maxWidth: '100%' }}>
            <Box sx = {{ paddingBottom: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant = 'h6' color= '#000' sx ={{ textAlign: 'start', fontSize: '1rem', paddingLeft: 2, color: '#000' }}>Câu hỏi phổ biến trong tháng</Typography>
              <Box sx = {{ display: 'flex', alignItems: 'center', alignItems: 'center', width: '100%' }}>
                {/* <LooksOneOutlinedIcon sx = {{ fontSize: '1.725rem', marginRight: '0.325rem' }}/> */}
                <Button variant = 'body1' color= '#000' sx = {{ textAlign: 'start', fontWeight: '400', color: '#000'}}>1. Tôi có thể tra cứu điểm và bảng điểm ở đâu?</Button>
              </Box>
              <Box sx = {{ display: 'flex', alignItems: 'center', alignItems: 'center', width: '100%' }}>
                {/* <LooksOneOutlinedIcon sx = {{ fontSize: '1.725rem', marginRight: '0.325rem' }}/> */}
                <Button variant = 'body1' color= '#000 !important' sx = {{ textAlign: 'start', fontWeight: '400', color: '#000' }}>2. Sinh viên bao nhiêu điểm đủ điều kiện đạt học lực Giỏi, Khá ?</Button>
              </Box>
              <Box sx = {{ display: 'flex', alignItems: 'center', alignItems: 'center', width: '100%' }}>
                {/* <LooksOneOutlinedIcon sx = {{ fontSize: '1.725rem', marginRight: '0.325rem' }}/> */}
                <Button variant = 'body1' color= '#000' sx = {{ textAlign: 'start', fontWeight: '400', color: '#000' }}>3. Điều kiện nhận học bổng khuyến học năm 2024 là gì?</Button>
              </Box>
            </Box>
          </Box>
        </Grid>
        
        <Grid size={3.75} offset={0} sx= {{ alignItems: 'start' }}>
          <Box sx = {{ padding: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 4px -2px 2px rgba(0, 0, 0, 0.1)', background: '#eaf5ff', borderRadius: '10px', width: '100%', maxWidth: '100%' }}>
            <Box sx = {{ paddingBottom: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant = 'h6' color= '#000' sx ={{ textAlign: 'start', fontSize: '1rem', paddingLeft: 2, color: '#000' }}>Câu hỏi phổ biến trong năm</Typography>
              <Box sx = {{ display: 'flex', alignItems: 'center', alignItems: 'center', width: '100%' }}>
                {/* <LooksOneOutlinedIcon sx = {{ fontSize: '1.725rem', marginRight: '0.325rem' }}/> */}
                <Button variant = 'body1' color= '#000' sx = {{ textAlign: 'start', fontWeight: '400', color: '#000' }}>1. Tôi có thể tra cứu điểm và bảng điểm ở đâu?</Button>
              </Box>
              <Box sx = {{ display: 'flex', alignItems: 'center', alignItems: 'center', width: '100%' }}>
                {/* <LooksOneOutlinedIcon sx = {{ fontSize: '1.725rem', marginRight: '0.325rem' }}/> */}
                <Button variant = 'body1' color= '#000' sx = {{ textAlign: 'start', fontWeight: '400', color: '#000' }}>2. Sinh viên bao nhiêu điểm đủ điều kiện đạt học lực Giỏi, Khá ?</Button>
              </Box>
              <Box sx = {{ display: 'flex', alignItems: 'center', alignItems: 'center', width: '100%' }}>
                {/* <LooksOneOutlinedIcon sx = {{ fontSize: '1.725rem', marginRight: '0.325rem' }}/> */}
                <Button variant = 'body1' color= '#000' sx = {{ textAlign: 'start', fontWeight: '400', color: '#000' }}>3. Điều kiện nhận học bổng khuyến học năm 2024 là gì?</Button>
              </Box>
            </Box>
          </Box>
        </Grid>

      </Grid>

    </CustomBlock>
  )
}

export default Dashboard

const useData = (documents) => {

  function createData(id = Math.floor(Math.random() * 72658721) ,  start_time = null, end_time = null, input_tokens = 0, output_tokens = 0, input_cached_tokens = 0, num_model_requests = 0) {
    return { id, start_time, end_time, input_tokens, output_tokens, input_cached_tokens, num_model_requests };
  }

  if(!documents) return {rows: [], columns: [], loading : false}
  const rows = Array.isArray(documents) && documents.map((document, zIndex) => {
    let start_time, end_time, input_tokens, output_tokens, input_cached_tokens, num_model_requests
    try {
      ( {start_time, end_time, input_tokens, output_tokens, input_cached_tokens, num_model_requests} = document )
    } catch (error) {
      console.error('Có lỗi Xảy Ra Khi Đọc Tài Liệu')      
    }
    return createData(zIndex, formatTime_Time_Date_Month_Year(start_time) , formatTime_Time_Date_Month_Year(end_time) , input_tokens, output_tokens, input_cached_tokens, num_model_requests )
  })

  const columns = [
    { 
      field: 'id', headerName: 'ID', width: 50,
      renderCell: (params) => params.row.id + 1
    },
    { 
      field: 'start_time', headerName: 'Thời Gian Bắt Đầu', width: 120,       
    },
    { 
      field: 'end_time', headerName: 'Thời Gian Kết Thúc', width: 150,
    },
    { 
      field: 'input_tokens', headerName: 'Input Tokens', width: 150,
      renderCell: (params) => (
        <Typography sx = {{ padding: '0 10px', background: params.value == 0 &&  'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000'}}>{params.value}</Typography>
      )
    },
    { 
      field: 'output_tokens', headerName: 'Output Tokens', width: 150,
      renderCell: (params) => (
        <Typography sx = {{  padding: '0 10px', background: params.value == 0 && 'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000'}}>{params.value}</Typography>
      )
    },
    { 
      field: 'input_cached_tokens', headerName: 'Input Cached Tokens', width: 150,
      renderCell: (params) => (
        <Typography sx = {{  padding: '0 10px', background: params.value == 0 &&  'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000'}}>{params.value}</Typography>
      )
    },
    { 
      field: 'num_model_requests', headerName: 'Số Lượt Requests', width: 150,
      renderCell: (params) => (
        <Typography sx = {{  padding: '0 10px', background: params.value == 0 &&  'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000' }}>{params.value}</Typography>
      ) 
    }
  ];

  return {rows, columns, loading : false}
}



import { LineChart } from '@mui/x-charts/LineChart';

const MockData_LineChart = {
  series: [
    {
      data: [2, 14, 104],
      label: 'Tổng số người dùng trong tháng'
    },
    {
      data: [0, 121, 404],
      label: 'Số lượt hỏi đáp trong tháng'
    }
  ],
  yAxis: [{ id: 'leftAxisId' }, { id: 'rightAxisId' }],
  rightAxis: null,
  xAxis: [{ scaleType: 'point', data: [
    'Tháng 1/2025',
    'Tháng 2/2025',
    'Tháng 3/2025'
  ] }]
}

export function BasicLineChart({width = 550, height = 230, data = MockData_LineChart}) {
  return (
    <LineChart
      sx = {{ '--mui-palette-text-primary' : '#000' }}
          width={width}
          height={height}
          series={data.series}
          xAxis={data?.xAxis}
          yAxis={data?.yAxis}
          rightAxis="rightAxisId"
          />
      );
}





import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const MockData_PieChart = {
  series: [
    {
      outerRadius: 80,
      data: [
        { label: 'Rất hài lòng', value: 57, color: '#1E3A8A' },
        { label: 'Hài Lòng', value: 10, color: '#3B82F6' },
        { label: 'Tạm Chấp Nhận', value: 14, color: '#60A5FA' },
        { label: 'Không Hài Lòng', value: 8, color: '#93C5FD' },
        { label: 'Rất Tệ', value: 10, color: '#D1E7FF' },
        { label: 'Không có phản hồi', value: 424, color: '#B0B0B0' },
      ],
      highlightScope: { fade: 'global', highlight: 'item' },
      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
      arcLabel: (params) => {
        const data = [
          { label: 'Rất hài lòng', value: 57, color: '#1E3A8A' },
          { label: 'Hài Lòng', value: 10, color: '#3B82F6' },
          { label: 'Tạm Chấp Nhận', value: 14, color: '#60A5FA' },
          { label: 'Không Hài Lòng', value: 8, color: '#93C5FD' },
          { label: 'Rất Tệ', value: 10, color: '#D1E7FF' },
          { label: 'Không có phản hồi', value: 424, color: '#B0B0B0' },
        ]
        const percent = params.value / data.map((item) => item.value).reduce((a, b) => a + b, 0);;
        if(percent * 100 < 10) return '' 
        return `${(percent * 100).toFixed(0)}%`;
      }
    },
  ]
}

const sizing = {
  // margin: { right: 5 },
  width: 400,
  height: 200,
  legend: { hidden: true },
};

export function PieChartWithCustomizedLabel({data = MockData_PieChart}) {
  return (
    <PieChart
      series = {data.series}
      sx={{
        '& text': {
          fontSize: '0.825rem !important'
        },
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontSize: 12,
        },
      }}
      {...sizing}
    />
  );
}


import { BarChart } from '@mui/x-charts/BarChart';
import MuiTable from '~/components/MuiTable/MuiTable';
import { formatTime_Date_Month, formatTime_Time_Date_Month_Year } from '~/utils/GetTime';
import usageCompletion from '~/apis/ChatGPT/usageCompletion';

const uData = [3681, 459285, 2000, 2780, 1890, 2390, 3490];
const xData = [487, 13492, 9800, 3908, 4800, 3800, 4300];
const aLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export function StackedBarChart() {
  return (
    <BarChart
    sx = {{ '--mui-palette-text-primary': '#000' }}
      width={500}
      height={300}
      series={[
        { data: xData, label: 'output', id: 'pvId', stack: 'total' },
        { data: uData, label: 'input', id: 'uvId', stack: 'total' },
      ]}
      xAxis={[{ data: aLabels, scaleType: 'band' }]}
    />
  );
}