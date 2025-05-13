const mongoose = require('mongoose')

const API_ConfigurationsSchema = new mongoose.Schema({
  service: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  config: { type: Object, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})


API_ConfigurationsSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

API_ConfigurationsSchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('API_Configurations', API_ConfigurationsSchema)

// {
//   "_id": "64f9d8d7b4c0aefad9a12345",
//   "service": "LLM",
//   "config": {
//     "api_key": "sk-...",
//     "endpoint": "https://api.openai.com/v1",
//     "model": "gpt-4"
//   },
//   "created_at": "2025-05-11T08:00:00Z",
//   "updated_at": "2025-05-11T08:00:00Z"
// }