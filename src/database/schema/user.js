import mongoose from '../connector'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    token: { type: String, default: '' },

    avatar: { type: String, default: '/upload/avatar_liandao08.jpg' },

    introduction: { type: String, default: '这个人很懒，什么都没留下来~' },

    collect: [{ type: ObjectId, ref: 'Article' }]
  },
  { collection: 'User', versionKey: false }
)

export default userSchema
