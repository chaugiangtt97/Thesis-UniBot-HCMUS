import { buildErrObject, handleError, isIDGood } from '~/middlewares/utils'
import { read_pdf } from '~/utils/read_pdf'
const path = require('path')
const fs = require('fs')
import Document from '~/models/document'
import Collection from '~/models/collection'
import { useKHTN_Chatbot } from '~/apis/apiRoute'
const { v4: uuidv4 } = require('uuid')
const { ObjectId } = require('mongodb')
function getFileExtension(fileName) {
  return path.extname(fileName)
}

function removeFileExtension(fileName) {
  return path.basename(fileName, path.extname(fileName))
}

export const uploadFile = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)

    if (!req.body?.collection) throw buildErrObject(422, 'COLLECTION NOT FOUND')
    if (!req.file) throw buildErrObject(400, 'No file uploaded.')

    if (!req.body.filename) throw buildErrObject(400, 'No file name.')

    const id_in_storage = new Date().getTime().toString() + '-' + (Math.random() * 900 + 100).toFixed(0)
    const filename = decodeURI(removeFileExtension(req.body.filename))
    const extensionFile = getFileExtension(req.file.originalname)
    const filePath = path.join(process.cwd(), '/public/storage', `${id_in_storage}-${filename}${extensionFile}`)

    const action = new Promise((resolve, reject) => {
      fs.writeFile(filePath, req.file.buffer, async (err) => {

        if (err) {
          reject(buildErrObject(500, err, 'Lỗi Ghi File'))
        }

        let content = null
        content = await read_pdf(filePath)
          .catch(() => { reject(buildErrObject(422, 'Cannot read file for getting chunk')) })

        let chunks = []
        chunks = await useKHTN_Chatbot.chunk_file(content).catch(
          () => { throw buildErrObject(422, 'Cannot chunk file') })

        try {
          chunks = chunks.map((chunk) => ({ id: uuidv4(), article: chunk }))
        } catch (error) {
          reject(buildErrObject(422, 'Cannot chunk file', 'Lỗi Ở Bước Chunking Text' + error?.message))
        }

        const collection = await Collection.findOne({ collection_name: req.body?.collection })

        const document = new Document({
          owner: id,
          originalName: `${filename}${extensionFile}`,
          collection_id: collection.toObject()._id, //req.body?.collection,
          document_name: filename,
          document_name_in_storage: `${id_in_storage}-${filename}${extensionFile}`,
          chunks: chunks,
          num_entities: chunks?.length,
          document_type: 'Upload',
          url: `/api/documents?name=${id_in_storage}-${filename}${extensionFile}`,
          metadata: null
        })

        // Collection.updateMany(
        //   { _id: new ObjectId(req.body?.collection) },
        //   { $inc: { amount_document: 1 } }
        // ).catch((err) => { reject(buildErrObject(422, err.message, 'Lỗi Ở Bước Save Document' + err?.message)) })

        document.save()
          .then((document) => resolve({ document }))
          .catch((err) => { reject(buildErrObject(422, err.message, 'Lỗi Ở Bước Save Document' + err?.message)) })
      })
    })

    action.then((data) => {
      res.status(200).send(data)
    }).catch((err) => handleError(res, err))

  } catch (error) {
    handleError(res, error.message)
  }
}

const ensureUploadDir = () => {
  const uploadDir = path.join(__dirname, '../../storage')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
}
ensureUploadDir()

export default uploadFile