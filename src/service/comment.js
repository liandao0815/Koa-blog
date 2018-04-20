import xss from 'xss'
import { Comment, Article } from '../database/model'
import Result from '../utils/result'
import { handleError } from '../utils/decorator'
import { getUserId } from '../utils/roles'

export default class CommentService {
  @handleError
  static async commit(articleid, content, headers) {
    const userid = await getUserId(headers)
    const comment = await Comment.create({
      user: userid,
      time: Date.now(),
      content: xss(content)
    })
    await Article.update(
      { _id: articleid, privated: false },
      { $addToSet: { comment: comment._id } }
    )
    return Result.success(null)
  }
}
