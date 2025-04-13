import { buildErrObject } from '../../../middlewares/utils'
import Document from '../../../models/document'
import Collection from '../../../models/collection'
import { ObjectId } from 'mongodb'
import { useKHTN_Chatbot } from '~/apis/KHTN_Chatbot'

export const deleteDocumentAndUpdateCollection = async (id = null) => {
  const KHTN_Chatbot = useKHTN_Chatbot()

  // const session = await mongoose.startSession().catch((error) => { throw buildErrObject(505, error.message) })
  // session.startTransaction()
  try {

    const deletedDocument = await Document.findOneAndDelete({ _id: new ObjectId(id), document_type: 'Upload' }
      // , { session }
    )
    // Bước 2: Cập nhật số lượng sách của tác giả
    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: new ObjectId(deletedDocument.collection_id) }, // Điều kiện tìm kiếm
      { $inc: { amount_document: -1 } }, // Cập nhật amount_document giảm 1
      { new: true } // Gộp new: true và session trong một đối tượng
    )

    if (!deletedDocument) {
      throw { message: 'No document found with the given ID and type \'Upload\'.' }
    }

    if ( deletedDocument?.state == 'success' ) {
      const formData = new FormData()
      formData.append('document_id', deletedDocument._id )
      formData.append('collection_name', updatedCollection.name )

      await KHTN_Chatbot.delete_file(formData)
        .catch((err) => ({ message: err }))
    }

    // await session.commitTransaction()
    // session.endSession()
    return { message: 'DELETE_SUCCESS' }
  }
  catch (error) {
    // await session.abortTransaction()
    // session.endSession()
    throw buildErrObject(505, error?.message)
  }
}

export default deleteDocumentAndUpdateCollection