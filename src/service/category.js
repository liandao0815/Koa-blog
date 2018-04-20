import { Category, Article } from '../database/model'
import Result, { ERROR_INFO } from '../utils/result'
import { getUserId } from '../utils/roles'
import { handleError } from '../utils/decorator'

export default class CategoryService {
  constructor({ categoryname, categoryid }) {
    this.categoryname = categoryname
    this.categoryid = categoryid
  }

  @handleError
  async create(headers) {
    const userid = await getUserId(headers)
    const conditions = {
      categoryname: this.categoryname,
      author: userid
    }
    const categoryData = await Category.findOne(conditions)

    if (categoryData) {
      return Result.error(
        ERROR_INFO.ExistCategory.code,
        ERROR_INFO.ExistCategory.msg
      )
    } else {
      return Result.success(await Category.create(conditions))
    }
  }

  @handleError
  async query(headers) {
    const userid = await getUserId(headers)
    if (this.categoryid) {
      const conditions = { category: this.categoryid, author: userid }
      const categoryData = await Article.findOne(conditions).populate(
        'category',
        'categoryname'
      )
      return Result.success(categoryData)
    } else {
      const categoryData = await Category.find({ author: userid })
      return Result.success(categoryData)
    }
  }

  @handleError
  async delete(headers) {
    const userid = await getUserId(headers)
    await Category.remove({ _id: this.categoryid, author: userid })
    return Result.success(null)
  }

  @handleError
  async modify(headers) {
    const userid = await getUserId(headers)
    await Category.update(
      { _id: this.categoryid, author: userid },
      { categoryname: this.categoryname }
    )
    return Result.success(null)
  }
}
