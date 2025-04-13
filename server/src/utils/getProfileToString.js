/* eslint-disable no-console */
import { useCode } from './message'

export const getProfileToString = (usr_profile) => {
  let character = ''
  try {
    if (usr_profile.role == 'administrator' || usr_profile.role == 'academic_administration') {
      character = `${usr_profile.name} là quản trị viên ${useCode(usr_profile.sex)} hệ thống 
đang công tác tại Trường Đại học Khoa học Tự nhiên, Đại học Quốc gia TP.HCM, 
với vị trí là ${useCode(usr_profile.position)} tại ${usr_profile.department}. 
Người dùng sinh vào ${usr_profile.birth}.
Người dùng có thể giao tiếp bằng cả tiếng Việt và tiếng Anh. Mong muốn rằng ${usr_profile.preferences}`
    }

    if (usr_profile.role == 'student') {
      const interest = usr_profile.interest.reduce((accumulator, currentValue) => {
        return accumulator + ', ' + useCode(currentValue)
      }, '')
      character = `${usr_profile.name} là ${useCode(usr_profile.sex)} sinh viên ${useCode(usr_profile.class)} 
đang học và sinh hoạt tại Trường Đại học Khoa học Tự nhiên, Đại học Quốc gia TP.HCM, 
Hệ đào tạo ${useCode(usr_profile.program)}, chuyên ngành ${useCode(usr_profile.major)}
Người dùng có thể giao tiếp bằng cả tiếng Việt và tiếng Anh.
Người dùng đang quan tâm về các vấn đề ${interest}`
    }
  } catch (error) {
    console.error(error)
    character = 'Không thể đọc thông tin của người dùng'
  }

  return character

}