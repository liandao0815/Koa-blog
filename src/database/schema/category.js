import mongoose from '../connector'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const categorySchema = new Schema(
  {
    categoryname: { type: String, required: true },

    author: { type: ObjectId, ref: 'User' }
  },
  { collection: 'Category', versionKey: false }
)

export default categorySchema
