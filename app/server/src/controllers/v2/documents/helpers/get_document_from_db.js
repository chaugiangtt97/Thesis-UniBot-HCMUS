import { useKHTN_Chatbot } from '~/apis/apiRoute'
import { buildErrObject } from '~/middlewares/utils'
import Document from '~/models/document'

/**
 * Gets document from database by id
 * @param _id document id. If _if == null, get all documents in db
 */

export const get_document_from_db = async (collection_name = null) => {
  try {
    const get_document_result = await useKHTN_Chatbot.get_documents_in_collection(collection_name)

    let list_documents = await Document.aggregate([
      {
        $lookup: {
          from: 'collections',
          localField: 'collection_id',
          foreignField: '_id',
          as: 'collection_info'
        }
      },
      {
        $unwind: '$collection_info'
      },
      {
        $match: {
          'collection_info.collection_name': collection_name // Lọc theo tên collection
        }
      }
    ])

    const collection_info = {
      collection_name: list_documents[0].collection_info.collection_name,
      long_name: list_documents[0].collection_info.long_name
    }

    list_documents = list_documents.map((document) => {
      return {
        document_id: document._id,
        document_name: get_document_result[document._id][0].title,
        url: get_document_result[document._id][0].url,
        num_entities: get_document_result[document._id].length,
        methods: document.methods,
        state: document.state,
        isactive: get_document_result[document._id][0].is_active,
        created_at: document.created_at,
        updated_at: document.updated_at,
        chunks: get_document_result[document._id]
      }
    })

    return {
      ...collection_info,
      documents: list_documents
    }

  } catch (e) {
    throw buildErrObject(422, 'CHAT_COLLECTION.DOCUMENT.ERR_GET_DOCUMENT', e)
  }

  // return await Document.findById(_id)
  //   .then(async ({ _doc }) => {
  //     if (!_doc) {
  //       return buildErrObject(422, 'NOT_FOUND')
  //     }

  //     let chunks = null
  //     let collection_name = null
  //     try {
  //       collection_name = await Collection.findById(_doc.collection_id)
  //         .then((_collection) => _collection.name )
  //         .catch(() => { throw buildErrObject(422, 'Không thể đọc collection') })
  //     } catch (error) {
  //       collection_name = null
  //     }

  //     try {
  //       if ((_doc.state == 'processing' || _doc.state == 'running' || _doc.state == 'queued')) {
  //         throw 'Đang xử lý'
  //       }
  //       if (_doc?.document_type && _doc?.document_type == 'Upload') {
  //         chunks = _doc?.chunks
  //       } else {

  //         const formData = new FormData
  //         formData.append('collection_name', collection_name )
  //         formData.append('document_id', _doc._id )
  //         chunks = await useKHTN_Chatbot().get_chunk_file(formData)
  //           .catch(() => { throw buildErrObject(422, 'Không thể đọc chunk từ db chatbot', 'Không thể đọc chunk từ api chatbot') })
  //         chunks = chunks.map((chunk) => ({ id: uuidv4(), chunk }))
  //       }

  //     } catch (error) {
  //       chunks = []
  //     }

  //     return { ..._doc, chunks: chunks, collection_name: collection_name }
  //   })
  //   .catch((err) => {
  //     throw buildErrObject(422, err.message)
  //   })
}