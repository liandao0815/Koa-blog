import mongoose from '../connector'

const Schema = mongoose.Schema

const userSchema =  new Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: String
})

export default userSchema
