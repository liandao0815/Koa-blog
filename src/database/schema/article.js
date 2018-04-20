import mongoose from '../connector'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const articleSchema = new Schema(
  {
    author: { type: ObjectId, ref: 'User', require: true },

    title: { type: String, required: true },

    content: { type: String, required: true },

    category: { type: ObjectId, ref: 'Category' },

    createTime: { type: Date, default: Date.now },

    updateTime: { type: Date, default: Date.now },

    readCount: { type: Number, default: 0 },

    comment: [{ type: ObjectId, ref: 'Comment' }],

    privated: { type: Boolean, default: false }
  },
  { collection: 'Article', versionKey: false }
)

export default articleSchema
