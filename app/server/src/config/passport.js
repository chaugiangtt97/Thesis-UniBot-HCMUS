import User from '../models/user'
import { decrypt } from '../middlewares/auth'
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null
  if (req.headers?.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim()
  } else if (req?.body?.token) {
    token = req.body.token.trim()
  } else if (req?.query?.token) {
    token = req.query.token.trim()
  } else if (req?.auth?.token) {
    token = req.auth.token.trim()
  }

  if (token) {
    // Decrypts token
    token = decrypt(token)
  }
  return token
}

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET
}

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.data._id).then((user) => {
    return !user ? done(null, false) : done(null, user)
  }).catch((err) => {
    return done(err, false)
  })
})

passport.use(jwtLogin)