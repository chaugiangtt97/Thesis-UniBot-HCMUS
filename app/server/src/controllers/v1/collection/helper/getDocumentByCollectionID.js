import Collection from '../../../../models/collection'
import { buildErrObject } from '../../../../middlewares/utils'
import { ObjectId } from 'mongodb'
/**
 * Gets document from database by collection id
 * @param {string} id - collection id
 */
export const getDocumentByCollectionID = async (id = '') => {
  const result = await Collection.aggregate([
    {
      $match: {
        _id: new ObjectId(id) // Điều kiện tìm kiếm user có userID = 124
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'documents',
        let: { collectionId: '$_id' }, // Biến để truyền _id vào pipeline
        pipeline: [
          { $match: { $expr: { $eq: ['$collection_id', '$$collectionId'] } } }, // Match theo collection_id
          { $sort: { createdAt: -1 } } // Sắp xếp documents giảm dần theo createdAt
        ],
        as: 'documents' // Tên trường sau khi join
      }
    }
  ]).then((document) => {
    if (!document || document.length == 0) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return document[0]
  }).catch((err) => {
    throw buildErrObject(422, err.message)
  })

  return result
}

export default getDocumentByCollectionID