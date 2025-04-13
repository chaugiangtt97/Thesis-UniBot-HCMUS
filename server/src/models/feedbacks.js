const mongoose = require('mongoose')
// const validator = require('validator')

const FeedbackSchema = new mongoose.Schema(
  {
    sender : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    question : {
      type: String
    },
    anwser : {
      type: String
    },
    message : {
      type: String
    },
    rating : {
      type: String,
      require: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
module.exports = mongoose.model('Feedback', FeedbackSchema)