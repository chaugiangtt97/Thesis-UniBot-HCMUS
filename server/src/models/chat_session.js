const mongoose = require('mongoose')

const ChatSessionSchema = new mongoose.Schema(
  {
    owner : { type: mongoose.Schema.Types.ObjectId, ref: 'User', require : true },
    session_name : {
      type: String,
      default: 'New Chat'
    },
    session_description : {
      type: String,
      default: 'Do Something ...'
    },
    amount_question : {
      type: Number,
      require: true
    },
    in_progress : {
      type: Object
    },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

ChatSessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chat_session', ChatSessionSchema)