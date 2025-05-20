import Collection from '../../../../models/collection'
import { buildErrObject } from '../../../../middlewares/utils'

/**
 * Gets collection from database by id
 */
export const getCollectionsFromDB = async () => {

  const result = await Collection.find({}).sort({ createdAt: 1 }).then((collections) => {
    if (!collections) {
      throw buildErrObject(422, 'NOT_FOUND')
    }
    return collections
  }).catch((err) => {
    throw buildErrObject(422, err.message)
  })

  return result
}

export default getCollectionsFromDB