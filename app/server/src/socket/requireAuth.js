/**
 * Updated by Mach Vi Kiet's author on November 15 2024
 */

import { savetoken } from './helper/savetoken'

const jwt = require('jsonwebtoken')
const passport = require('passport')
import { decrypt } from '../middlewares/auth'

export const requireAuth = async (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication error: Token required'))
  }

  jwt.verify(decrypt(token), process.env.JWT_SECRET, async (err) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'))
    }
    try {
      passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
          return next(new Error('Authentication error: User not found'))
        }

        await savetoken(token, socket.id)

        socket.user = user
        next()
      })(socket.handshake, {}, next)
    } catch (err) {
      return next(new Error('Authentication error'))
    }
  })
}

export default requireAuth