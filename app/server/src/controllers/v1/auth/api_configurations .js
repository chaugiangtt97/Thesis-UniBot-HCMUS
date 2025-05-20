import { handleError } from '../../../middlewares/utils'
import getKeyAPI_Service from './helpers/getKeyAPI_Service'

export const getAPI_Configurations = async (req, res) => {
  try {
    let code = req.query.code.toUpperCase()

    res.status(200).json(await getKeyAPI_Service(code))
  } catch (error) {
    handleError(res, error)
  }
}

export default getAPI_Configurations