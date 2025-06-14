/**
 * @async
 * @function register
  Information about the user is extracted from the request body and validated.
 * @param {string} req.email - The email of the user.
 * @param {string} req.password - The password of the user.
 * @param {string} [req.name] - The name of the user (optional).
 * @param {string} [req.captchaToken] - The captcha token for verification.
 * @param {string} [req.educationRole] - The education role of the user (e.g., 'student' or 'lecturer').
  Role is used to determine the type of user and the required fields.
 ========= Student =================
 * @param {string} [req.trainingProgram] - The training program of the user (optional, students or lectures).
 * @param {string} [req.trainingBatch] - The training batch of the user (optional, for students).
 * @param {string} [req.selectedMajor] - The selected major of the user (optional, for students).
 ========= lecturer =================
 * @param {string} [req.administrativeUnit] - The administrative unit of the user (optional, for lecturers).
 * @param {string} [req.lecturerPosition] - The lecturer position of the user (optional, for lecturers).
 * @param {string} [req.teachingDepartment] - The teaching department of the user (optional, for lecturers).
 *
 */


import { matchedData } from 'express-validator'
import getUserInfo from './helpers/getUserInfo'
import registerUser from './helpers/registerUser'
import returnRegisterToken from './helpers/returnRegisterToken'
import { buildErrObject, handleError } from '../../../middlewares/utils'
import { checkEmailExists } from './email/helpers/emailExists'
import { prepareToSendEmail } from '../../../middlewares/emailer'

export const register_controller = async (req, res) => {
  try {
    // Extract and sanitize request data
    const requestData = matchedData(req)
    // Check if the email already exists
    const emailExists = await checkEmailExists(requestData.email)
    const NODE_ENV = process.env?.NODE_ENV || 'development'
    if (!emailExists) {
      // Register the user
      const newUser = await registerUser(requestData)

      // Prepare user info and response token
      const userInfo = getUserInfo(newUser)
      const response = returnRegisterToken(newUser._id, userInfo)

      // Send registration email
      NODE_ENV == 'production' && prepareToSendEmail(newUser)

      // Respond with success
      return res.status(201).json(response)
    }

    // Handle case where email already exists
    handleError(res, buildErrObject(400, 'AUTH.EMAIL.EMAIL_ALREADY_EXIST', 'Email already exists'))
  } catch (error) {
    // Handle unexpected errors
    handleError(res, error)
  }
}

export default register_controller
