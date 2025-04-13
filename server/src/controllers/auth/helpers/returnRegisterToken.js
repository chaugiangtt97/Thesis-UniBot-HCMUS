import generateToken from './generateToken'

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
export const returnRegisterToken = (
  { _id = '', verification = '' },
  userInfo = {}
) => {

  if (process.env.NODE_ENV !== 'production') {
    userInfo.verification = verification
  }

  const data = {
    token: generateToken(_id),
    user: userInfo
  }

  return data
}

export default returnRegisterToken
