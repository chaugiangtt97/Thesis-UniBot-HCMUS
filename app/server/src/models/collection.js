const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema(
  {
    collection_name: {
      type: String,
      required: true
    },
    long_name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '0'
    },
    type: {
      type: String,
      enum: ['obliged', 'option', 'upload'],
      default: 'option'
    },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

CollectionSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})
module.exports = mongoose.model('collections', CollectionSchema)