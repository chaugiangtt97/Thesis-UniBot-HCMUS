const mongoose = require('mongoose')
// const validator = require('validator')

const DocumentSchema = new mongoose.Schema(
  {
    owner : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    collection_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    url: {
      type: String,
      required: true
    },
    document_name: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    document_name_in_storage: {
      type: String
    },
    document_description: {
      type: String,
      default: 'Tài Liệu Trường Khoa Học Tự Nhiên'
    },
    document_type: {
      type: String,
      required: true
    },
    amount_chunking: {
      type: String,
      default: '0'
    },
    chunks: {
      type: Array,
      default: []
    },
    methods: {
      type: String,
      enum: ['basic'],
      default: 'basic'
    },
    isactive:  {
      type: Boolean,
      default: false
    },
    metadata: {
      type: Object,
      default: null
    },
    dag_id: {
      type: Object,
      default: null
    },
    dag_run_id: {
      type: Object,
      default: null
    },
    state: {
      type: String,
      default : 'pending'
    },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    timestamps: true
  }
)


DocumentSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Document', DocumentSchema)