const multer = require('multer')

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'src/storage/')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + `${getFileExtension(file.originalname)}`
//     cb(null, uniqueSuffix)
//   }
// })

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/storage/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, uniqueSuffix)
  }
})

export const upload = multer({
  storage: storage,
  fileFilter: async (req, file, cb) => {
    try {
      const allowedTypes = ['application/pdf', 'text/plain']
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('File không hợp lệ! Chỉ chấp nhận file PDF và TXT.'))
      }

      cb(null, true)
    } catch (error) {
      return cb(new Error(error))
    }
  }
})

export default upload