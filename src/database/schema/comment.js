import mongoose from '../connector'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const commentSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User' },

    time: { type: Date, default: Date.now },

    content: { type: String, default: '' }
  },
  { collection: 'Comment', versionKey: false }
)

export default commentSchema
