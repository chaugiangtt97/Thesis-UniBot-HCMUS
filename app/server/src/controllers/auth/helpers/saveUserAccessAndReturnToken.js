/* eslint-disable no-console */
import UserAccess from '../../../models/userAccess'
import { getUserInfo } from './getUserInfo'
import generateToken from './generateToken'
import { getIP, getBrowserInfo, buildErrObject } from '../../../middlewares/utils'

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
export const saveUserAccessAndReturnToken = async (req = {}, user = {}) => {
  const token = generateToken(user._id)

  const userAccess = new UserAccess({
    email: user.email,
    user: user._id,
    ip: getIP(req),
    browser: getBrowserInfo(req),
    country: 'Viet Nam',
    token: token,
    socketid: null
  })

  console.log('login userAccess', user.email)


  const result = await userAccess.save().then(async () => {
    const userInfo = getUserInfo(user)
    return ({
      token: token,
      user: userInfo
    })
  }).catch((err) => {
    return buildErrObject(422, err.message)
  })

  return result
}

export default saveUserAccessAndReturnToken
