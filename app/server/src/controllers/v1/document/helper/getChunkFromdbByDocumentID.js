import { useKHTN_Chatbot } from '../../../../apis/KHTN_Chatbot'
import { buildErrObject } from '../../../../middlewares/utils'

import Document from '../../../../models/document'
import Collection from '../../../../models/collection'

const { v4: uuidv4 } = require('uuid')

export const getChunkFromdbByDocumentID = async (id = '') => {
  const result = await Document.findById(id).then(async ({ _doc }) => {
    if (!_doc) {
      return buildErrObject(422, 'NOT_FOUND')
    }

    let chunks = null
    let collection_name = null
    try {
      collection_name = await Collection.findById(_doc.collection_id)
        .then((_collection) => _collection.name )
        .catch(() => { throw buildErrObject(422, 'Không thể đọc collection') })
    } catch (error) {
      collection_name = null
    }

    try {
      if ((_doc.state == 'processing' || _doc.state == 'running' || _doc.state == 'queued')) {
        throw 'Đang xử lý'
      }
      if (_doc?.document_type && _doc?.document_type == 'Upload') {
        chunks = _doc?.chunks
      } else {

        const formData = new FormData
        formData.append('collection_name', collection_name )
        formData.append('document_id', _doc._id )
        chunks = await useKHTN_Chatbot().get_chunk_file(formData)
          .catch(() => { throw buildErrObject(422, 'Không thể đọc chunk từ db chatbot', 'Không thể đọc chunk từ api chatbot') })
        chunks = chunks.map((chunk) => ({ id: uuidv4(), chunk }))
      }

    } catch (error) {
      chunks = []
    }

    return { ..._doc, chunks: chunks, collection_name: collection_name }
  }).catch((err) => {
    throw buildErrObject(422, err.message)
  })

  return result
}

export default getChunkFromdbByDocumentID