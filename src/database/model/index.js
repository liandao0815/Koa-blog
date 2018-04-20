import mongoose from '../connector'
import userSchema from '../schema/user'
import articleSchema from '../schema/article'
import commentSchema from '../schema/comment'
import categorySchema from '../schema/category'

export const User = mongoose.model('User', userSchema)
export const Article = mongoose.model('Article', articleSchema)
export const Comment = mongoose.model('Comment', commentSchema)
export const Category = mongoose.model('Category', categorySchema)
