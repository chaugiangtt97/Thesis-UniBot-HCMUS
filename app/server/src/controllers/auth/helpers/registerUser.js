import User from '../../../models/user'
import { buildErrObject, handleError } from '../../../middlewares/utils'

/**
 * @async
 * @function registerUser
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

export const registerUser = async (req = {}) => {
  let userRecord = {
    name: req.name,
    email: req.email,
    password: req.password,
    academicInformation : req?.academicInformation,
    generalInformation: req?.generalInformation,
    verification: Math.floor(100000 + Math.random() * 900000),
    verified: process.env.NODE_ENV !== 'production'
  }

  if (req.educationRole === 'student') {
    userRecord = new User({...userRecord, educationRole: 'student' })
  }

  if (req.educationRole === 'lecturer') {
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9]*@clc\.fitus\.edu\.vn$/

    if (!emailRegex.test(req.email)) {
      handleError(res, 'Email must be in the format of @clc.fitus.edu.vn for lecturers')
    }

    userRecord = new User({...userRecord, educationRole: 'lecturer' })
  }

  const res = await userRecord.save()
    .then(item => item)
    .catch((err) => { throw buildErrObject(422, err.message) })

  return res

}

export default registerUser
