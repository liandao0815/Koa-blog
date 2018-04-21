import xss from 'xss'
import { Article, Category } from '../database/model'
import Result from '../utils/result'
import { getUserId } from '../utils/roles'
import { handleError } from '../utils/decorator'

export default class ArticleService {
  constructor({ articleid, title, content, categoryid, privated }) {
    this.articleid = articleid
    this.title = title
    this.content = content
    this.categoryid = categoryid
    this.privated = privated
  }

  @handleError
  async publish(headers) {
    const userid = await getUserId(headers)
    const category = await Category.findOne({
      _id: this.categoryid,
      author: userid
    })
    const article = new Article({
      author: userid,
      title: xss(this.title),
      content: xss(this.content),
      category: category._id,
      privated: 'true' === this.privated
    })

    await article.save()
    return Result.success(null)
  }

  @handleError
  static async search(q) {
    const conditions = {
      title: { $regex: new RegExp(`${q}`, 'i') },
      privated: false
    }
    const sort = { updateTime: -1 }
    const options = { category: 0, privated: 0 }
    const searchData = await Article.find(conditions, options).sort(sort)
    return Result.success(searchData)
  }

  @handleError
  async delete(headers) {
    const userid = await getUserId(headers)
    await Article.remove({ _id: this.articleid, author: userid })
    return Result.success(null)
  }

  @handleError
  async update(headers) {
    const userid = await getUserId(headers)
    const category = await Category.findOne({
      _id: this.categoryid,
      author: userid
    })

    await Article.update(
      { _id: this.articleid, author: userid },
      {
        title: xss(this.title),
        content: xss(this.content),
        category: category._id,
        privated: 'true' === this.privated,
        updateTime: Date.now()
      }
    )
    return Result.success(null)
  }

  @handleError
  async select() {
    const conditions = { _id: this.articleid, privated: false }
    const options = { category: 0, privated: 0 }
    await Article.update(conditions, {
      $inc: { readCount: 1 }
    })
    const articleData = await Article.findOne(conditions, options).populate({
      path: 'comment',
      populate: { path: 'user', select: 'username' }
    })
    return Result.success(articleData)
  }

  @handleError
  static async query(pageSize = 10, currentPage = 1) {
    const conditions = { privated: false }
    const options = { category: 0, privated: 0 }
    const skipCount = (parseInt(currentPage) - 1) * parseInt(pageSize)
    const sort = { updateTime: -1 }

    const totalCount = await Article.count(conditions)
    const articleData = await Article.find(conditions, options)
      .skip(skipCount)
      .limit(parseInt(pageSize))
      .sort(sort)
    const currentCount = articleData.length
    const queryData = { totalCount, currentCount, articleData }

    return Result.success(queryData)
  }
}
