/* eslint-disable no-console */
const WebSocket = require('ws')

const ws = new WebSocket('http://localhost:3000') // Replace with your WebSocket URL

ws.on('open', () => {
  console.log('WebSocket connection established')
  ws.send('Ping')
})

ws.on('message', (message) => {
  console.log('Received from server:', message)
  ws.close()
})

ws.on('error', (error) => {
  console.error('WebSocket error:', error)
})

ws.on('close', () => {
  console.log('WebSocket connection closed')
})