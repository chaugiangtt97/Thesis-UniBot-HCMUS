import { useKHTN_Chatbot } from '../../../apis/KHTN_Chatbot'
import { buildErrObject } from '../../../middlewares/utils'
import Document from '../../../models/document'

export const enhanceDocumentAPI = async (id = '', req = null) => {
  if (!req?.body.collection_name) throw buildErrObject(422, 'Collection name is require')
  if (!req?.body.article) throw buildErrObject(422, 'Article name is require')
  try {
    const formData = new FormData
    formData.append('collection_name', req?.body.collection_name )
    formData.append('article', req?.body.article )
    const newDocument = await useKHTN_Chatbot().enhance_file(formData)
      .catch((err) => { throw buildErrObject(422, 'Không thể yêu cầu enhance từ chatbot', err) })

    const res = await Document.findByIdAndUpdate( id,
      { $set: { metadata: newDocument.metadata,
        chunks: newDocument.chunks.map((chunk) => {
          return {
            id: 'id-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
            chunk: chunk
          }
        })
      } }, { new: true })
      .catch((err) => { throw buildErrObject(422, 'Không thể cập nhật document', err) })

    return res
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

export default enhanceDocumentAPI