/* eslint-disable no-console */
/**
 * Updated by Mach Vi Kiet's author on November 3 2024
 */

import mongoose from 'mongoose'
import loadModels from '../models'

const mongoURI = process.env.MONGODB_URI || 'http://localhost:27017'

export const initMongo = async () => {
  mongoose.set('strictQuery', false)
  // Options object
  console.log('\n')
  console.log('\x1b[33m%s\x1b[0m', 'Connecting to MongoDB ...')
  const connectToMongoDB = async () => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        loadModels()
        console.log('\x1b[32m%s\x1b[0m', '*    MongoDB database connection established successfully')
        console.log('\x1b[32m%s\x1b[0m', `*    NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
        console.log('\x1b[32m%s\x1b[0m', `*    NODE_ENV: ${process.env.MONGODB_URI || 'http://localhost:27017'}`)
      })
      .catch((err) => {
        console.error('\x1b[31m%s\x1b[0m', '[Error] Cannot connect to MongoDB:', err.message)
        console.log('\x1b[33m%s\x1b[0m', 'Retrying connection in 5 seconds...')
        setTimeout(connectToMongoDB, 5000) // Thử kết nối lại sau 5 giây
        throw new Error(err)
      })
  }
  mongoose.connection.on('disconnected', () => {
    console.warn('\x1b[33m%s\x1b[0m', '[Warning] MongoDB connection lost. Attempting to reconnect...')
    connectToMongoDB()
  })
  await connectToMongoDB()
  return
}

export default initMongo
