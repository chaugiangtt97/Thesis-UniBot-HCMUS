import { buildErrObject } from '../../../../middlewares/utils'

import Document from '../../../../models/document'

export const saveNewDocumentToDB = async (id = null, data = null) => {
  const result = await Document.findByIdAndUpdate(id, data, { new: true }).then(async (_doc) => {
    if (!_doc) {
      return buildErrObject(422, 'NOT_FOUND')
    }

    return _doc
  }).catch((err) => {
    throw buildErrObject(422, err.message)
  })

  return result
}

export default saveNewDocumentToDB