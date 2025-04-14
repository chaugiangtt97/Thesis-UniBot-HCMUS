const mongoose = require('mongoose')
import { hash as _hash, genSalt as _genSalt, compare } from 'bcrypt'
import { isEmail } from 'validator'
import mongoosePaginate from 'mongoose-paginate-v2'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: (str, option) => {
          return isEmail(str, option)
        },
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    sex: {
      type: String,
      enum: ['male', 'female']
    },
    personal_email: {
      type: String,
      validate: {
        validator: (str, option) => {
          return isEmail(str, option)
        },
        message: 'EMAIL_IS_NOT_VALID'
      }
    },
    interest: {
      type: Array,
      default: []
    },
    department: {
      type: String
    },
    role: {
      type: String,
      enum: ['student', 'researcher', 'administrator', 'academic_administration'],
      default: 'student'
    },
    program: {
      type: String,
      enum: ['PR-CLC', 'PR-CNTN', 'PR-DT', 'PR-VP']
    },
    class: {
      type: String,
      enum: ['K20', 'K21', 'K22', 'K23', 'K24']
    },
    verification: {
      type: String
    },
    position: {
      type: String,
      enum: ['ROLE-TP', 'ROLE-PP', 'ROLE-NV', 'ROLE-CTV']
    },
    verified: {
      type: Boolean,
      default: false
    },
    message: {
      type: String
    },
    phone: {
      type: String
    },
    birth: {
      type: Date
    },
    degree: {
      type: String,
      enum: ['Cử Nhân', 'Thạc Sĩ', 'Tiến Sĩ', 'Sinh viên chưa tốt nghiệp', 'Không có'],
      default: 'Không có'
    },
    database: {
      type: Array,
      default: []
    },
    researcher_area: {
      type: Array,
      default: []
    },
    major: {
      type: String,
      default: 'Công nghệ thông tin'
    },
    projects: {
      type: Array,
      default: []
    },
    methods: {
      type: Array,
      default: ['Công văn', 'Văn bản', 'Sổ tay sinh viên']
    },
    technical: {
      type: Array,
      default: []
    },
    languages: {
      type: Array,
      default: ['Tiếng việt', 'Tiếng anh']
    },
    goals: {
      type: Array,
      default: ['Tìm hiểu thông tin trường đại học Khoa Học Tự Nhiên']
    },
    preferences: {
      type: String,
      default: 'Ưu tiên văn bản chính thống, nội quy, công văn của trường học'
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (user, salt, next) => {
  _hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    user.password = newHash
    return next()
  })
}

const genSalt = (user, SALT_FACTOR, next) => {
  _genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(user, salt, next)
  })
}

UserSchema.pre('save', function (next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}

UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', UserSchema)
