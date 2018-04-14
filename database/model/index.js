import mongoose from '../connector'
import userSchema from '../schema/userSchema'

export const User = mongoose.model('User', userSchema)
