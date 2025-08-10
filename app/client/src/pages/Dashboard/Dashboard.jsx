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
  const { processHandler, dashboard, noticeHandler } = useOutletContext();
  const token = useSelector(state => state.auth.token)

  const [dataChatGPT, setDataChatGPT] = useState([])

  useEffect(() => {
    document.title = 'Chatbot - Trang Chủ';
    dashboard.navigate.active(234)

    return () => (
      dashboard.navigate.active('#')
    )
  }, [])

  // useEffect(() => {
  //   const dataChatGPT_format = (data) => {
  //     let totalInputTokens = 0
  //     let totalOutputTokens = 0
  //     let totalInputCachedTokens = 0
  //     let totalNumModelRequests = 0
  //     let totalTokenInDate = []
  //     let dateLabel = []
  //     let inputTokens = []
  //     let outputTokens = []
  //     let inputCachedTokens = []
  //     let numModelRequests = []

  //     data['data'].forEach(bucket => {
  //       dateLabel.push(formatTime_Date_Month(bucket.start_time))
  //       if (bucket['results'].length == 0) {
  //         inputTokens.push(0)
  //         outputTokens.push(0)
  //         inputCachedTokens.push(0)
  //         numModelRequests.push(0)
  //         totalTokenInDate.push(0)
  //         return
  //       }
  //       bucket.results.forEach(result => {
  //         totalInputTokens += result.input_tokens
  //         totalOutputTokens += result.output_tokens
  //         totalInputCachedTokens += result.input_cached_tokens
  //         totalNumModelRequests += result.num_model_requests

  //         inputTokens.push(result.input_tokens)
  //         outputTokens.push(result.output_tokens)
  //         inputCachedTokens.push(result.input_cached_tokens)
  //         numModelRequests.push(result.num_model_requests)
  //         totalTokenInDate.push(totalInputTokens + totalOutputTokens + totalInputCachedTokens + totalNumModelRequests)
  //       })
  //     })

  //     return {
  //       data: data['data'].map((data) => ({ ...data, ...data['results'][0] })),
  //       total_input_request_tokens: totalInputTokens,
  //       total_output_request_tokens: totalOutputTokens,
  //       total_cached_request_tokens: totalInputCachedTokens,
  //       total_requests: totalNumModelRequests,
  //       dateLabel, inputTokens, outputTokens, inputCachedTokens, numModelRequests, totalTokenInDate
  //     }
  //   }
  //   const getGPTData = async () => {
  //     // const ChatGPT_Event = processHandler.add('#chatgpt')
  //     let chatGPTDataResponse = {
  //       data: [],
  //       has_more: true,
  //       next_page: null
  //     }

  //     try {
  //       while (chatGPTDataResponse.has_more) {
  //         await usageCompletion(chatGPTDataResponse.next_page)
  //           .then((data) => {
  //             chatGPTDataResponse = { data: [...chatGPTDataResponse.data, ...data['data']], has_more: data['has_more'], next_page: data['next_page'] }
  //             setDataChatGPT(dataChatGPT_format(chatGPTDataResponse))
  //           })
  //           .catch((e) => {
  //             chatGPTDataResponse = { ...chatGPTDataResponse, has_more: false }
  //             throw e
  //           })
  //       }
  //     } catch (error) {
  //       console.log('catch lỗi : ', error)
  //       noticeHandler.add({
  //         status: 'error',
  //         message: 'Lấy Dữ Liệu ChatGPT không thành công'
  //       })
  //       return null
  //     }
  //     // processHandler.remove('#chatgpt', ChatGPT_Event)
  //     return chatGPTDataResponse
  //   }

  //   getGPTData()
  //   // .then((data) => {
  //   //   if(data) {
  //   //     setDataChatGPT(() => {
  //   //       let totalInputTokens = 0
  //   //       let totalOutputTokens = 0
  //   //       let totalInputCachedTokens = 0
  //   //       let totalNumModelRequests = 0
  //   //       let totalTokenInDate = []
  //   //       let dateLabel = []
  //   //       let inputTokens = []
  //   //       let outputTokens = []
  //   //       let inputCachedTokens = []
  //   //       let numModelRequests = []

  //   //       data['data'].forEach(bucket => {
  //   //           dateLabel.push(formatTime_Date_Month(bucket.start_time))
  //   //           if(bucket['results'].length == 0) {
  //   //             inputTokens.push(0)
  //   //             outputTokens.push(0)
  //   //             inputCachedTokens.push(0)
  //   //             numModelRequests.push(0)
  //   //             totalTokenInDate.push(0)
  //   //             return
  //   //           }
  //   //           bucket.results.forEach(result => {
  //   //               totalInputTokens += result.input_tokens
  //   //               totalOutputTokens += result.output_tokens
  //   //               totalInputCachedTokens += result.input_cached_tokens
  //   //               totalNumModelRequests += result.num_model_requests

  //   //               inputTokens.push(result.input_tokens)
  //   //               outputTokens.push(result.output_tokens)
  //   //               inputCachedTokens.push(result.input_cached_tokens)
  //   //               numModelRequests.push(result.num_model_requests)
  //   //               totalTokenInDate.push(totalInputTokens + totalOutputTokens + totalInputCachedTokens + totalNumModelRequests)
  //   //           })
  //   //       })

  //   //       return {
  //   //         data: data['data'].map((data) => ({...data, ...data['results'][0]})),
  //   //         total_input_request_tokens: totalInputTokens,
  //   //         total_output_request_tokens: totalOutputTokens,
  //   //         total_cached_request_tokens: totalInputCachedTokens,
  //   //         total_requests: totalNumModelRequests,
  //   //         dateLabel, inputTokens, outputTokens, inputCachedTokens, numModelRequests, totalTokenInDate
  //   //       }
  //   //     })
  //   //   }
  //   // })

  // }, [token])


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
    xAxis: [{
      scaleType: 'point', data: dataChatGPT?.dateLabel || ['không có dữ liệu']
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
          if (percent * 100 < 10) return ''
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
          if (percent * 100 < 15) return ''
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
          if (percent * 100 < 10) return ''
          return `${(percent * 100).toFixed(0)}%`;
        }
      },
    ]
  }

  return (
    <CustomBlock sx={{ width: '100%', boxShadow: 'none', border: 'none', background: 'transparent', overflowX: 'hidden' }}>

    </CustomBlock>
  )
}

export default Dashboard

const useData = (documents) => {

  function createData(id = Math.floor(Math.random() * 72658721), start_time = null, end_time = null, input_tokens = 0, output_tokens = 0, input_cached_tokens = 0, num_model_requests = 0) {
    return { id, start_time, end_time, input_tokens, output_tokens, input_cached_tokens, num_model_requests };
  }

  if (!documents) return { rows: [], columns: [], loading: false }
  const rows = Array.isArray(documents) && documents.map((document, zIndex) => {
    let start_time, end_time, input_tokens, output_tokens, input_cached_tokens, num_model_requests
    try {
      ({ start_time, end_time, input_tokens, output_tokens, input_cached_tokens, num_model_requests } = document)
    } catch (error) {
      console.error('Có lỗi Xảy Ra Khi Đọc Tài Liệu')
    }
    return createData(zIndex, formatTime_Time_Date_Month_Year(start_time), formatTime_Time_Date_Month_Year(end_time), input_tokens, output_tokens, input_cached_tokens, num_model_requests)
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
        <Typography sx={{ padding: '0 10px', background: params.value == 0 && 'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000' }}>{params.value}</Typography>
      )
    },
    {
      field: 'output_tokens', headerName: 'Output Tokens', width: 150,
      renderCell: (params) => (
        <Typography sx={{ padding: '0 10px', background: params.value == 0 && 'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000' }}>{params.value}</Typography>
      )
    },
    {
      field: 'input_cached_tokens', headerName: 'Input Cached Tokens', width: 150,
      renderCell: (params) => (
        <Typography sx={{ padding: '0 10px', background: params.value == 0 && 'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000' }}>{params.value}</Typography>
      )
    },
    {
      field: 'num_model_requests', headerName: 'Số Lượt Requests', width: 150,
      renderCell: (params) => (
        <Typography sx={{ padding: '0 10px', background: params.value == 0 && 'yellow', fontSize: '0.725rem !important', fontWeight: params.value == 0 ? '800' : '#', textDecoration: params.value == 0 && 'underline', color: theme => params.value == 0 ? 'red' : theme.palette.mode == 'dark' ? '#fff' : '#000' }}>{params.value}</Typography>
      )
    }
  ];

  return { rows, columns, loading: false }
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
  xAxis: [{
    scaleType: 'point', data: [
      'Tháng 1/2025',
      'Tháng 2/2025',
      'Tháng 3/2025'
    ]
  }]
}

export function BasicLineChart({ width = 550, height = 230, data = MockData_LineChart }) {
  return (
    <LineChart
      sx={{ '--mui-palette-text-primary': '#000' }}
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
        if (percent * 100 < 10) return ''
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

export function PieChartWithCustomizedLabel({ data = MockData_PieChart }) {
  return (
    <PieChart
      series={data.series}
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
      sx={{ '--mui-palette-text-primary': '#000' }}
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