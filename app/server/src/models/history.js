const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema(
  {
    sender : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    session_id: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Chat_session'
    },
    question : {
      type: String,
      require: true
    },
    anwser : {
      type: String,
      require: true
    },
    source: {
      type: Array,
      default: []
    },
    context: {
      type: String,
      default: null
    },
    resource: {
      type: Object,
      default: {
        type: 'none'
      }
    },
    rating: {
      type: Number,
      default: -1
    },
    state : {
      type: String,
      require: true
    },
    duration : {
      type: String,
      require: true
    },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

HistorySchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('History', HistorySchema)