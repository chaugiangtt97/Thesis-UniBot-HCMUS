/* eslint-disable no-console */
/**
 * Updated by Mach Vi Kiet's author on November 3 2024
 */

import initMongo from './config/mongodb.js'
const app = require('./app.js')
// const https = require('https')
const https = require('http')
const io = require('./socket')
var fs = require('fs')
const path = require('path')
const keyPath = path.join(process.cwd(), './cert/client-key.pem')
const certPath = path.join(process.cwd(), './cert/client-cert.pem')

var options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
}
async function bootstrap () {

  await initMongo()
  // return http.createServer(app).listen(process.env.APP_PORT || 3000)
  return https.createServer(options, app).listen(process.env.APP_PORT || 3000)
}

bootstrap().then(async (server) => {
  io.attach(server, {
    cors: {
      origin: '*', //process.env.CLIENT, //'http://localhost:5173',
      methods: ['GET', 'POST']
      // credentials: true
    },
    transports: ['websocket', 'polling']
  })

  console.log('\n')
  console.log('\x1b[36m', `Server is listening at ${ process.env.APP_PROTOCOL }://${ process.env.APP_HOST }:${ process.env.APP_PORT }/`)
}).catch((err) => {
  console.log('Khởi Động Server Thất Bại !', err)
})

module.exports = app
