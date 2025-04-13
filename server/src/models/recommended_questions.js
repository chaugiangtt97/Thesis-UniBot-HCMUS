const mongoose = require('mongoose')

const RQuestionsSchema = new mongoose.Schema(
  {
    question : {
      type: String,
      require: true
    },
    source: {
      type: Array,
      default: []
    },
    resource: {
      type: Object,
      default: {
        type: 'none'
      }
    },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

RQuestionsSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('recommended_question', RQuestionsSchema)