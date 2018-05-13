import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import xss from 'xss'
import Crypto from '../utils/crypto'
import { User, Article } from '../database/model'
import { TOKEN_SECRET, TOKEN_EXPIRESIN, PASSWORD_SALT } from '../config/application'
import Result, { ERROR_INFO } from '../utils/result'
import { getToken, getUserId } from '../utils/roles'
import { handleError } from '../utils/decorator'

export default class UserService {
  constructor({ username, password, avatar, introduction, collect }) {
    this.username = username
    this.password = password
    this.avatar = avatar
    this.introduction = introduction
    this.collect = collect
  }

  @handleError
  static async getUserInfo(headers) {
    const token = getToken(headers)
    const userData = await User.findOne({ token })

    try {
      jwt.verify(userData.token, TOKEN_SECRET)
      const _userData = await User.findOne({ token }, { password: 0 }).populate({
        path: 'collect',
        populate: { path: 'author', select: 'username avatar' }
      })
      return Result.success(_userData)
    } catch (error) {
      return Result.error(ERROR_INFO.InvalidToken.code, ERROR_INFO.InvalidToken.msg)
    }
  }

  @handleError
  async register() {
    const userData = await User.findOne({ username: this.username })

    if (userData) {
      return Result.error(ERROR_INFO.ExistAccount.code, ERROR_INFO.ExistAccount.msg)
    } else if (this.username.length > 10) {
      return Result.error(ERROR_INFO.BeyondLength.code, ERROR_INFO.BeyondLength.msg)
    } else {
      const token = jwt.sign({ username: this.username }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRESIN
      })
      const crypto = new Crypto(PASSWORD_SALT, this.password)
      const user = new User({
        username: this.username,
        password: crypto.encrypt(),
        token
      })
      await user.save()
      return Result.success(
        await User.findOne({ username: this.username }, { password: 0 }).populate('collect')
      )
    }
  }

  @handleError
  async login() {
    const crypto = new Crypto(PASSWORD_SALT, this.password)
    const userData = await User.findOne(
      { username: this.username, password: crypto.encrypt() },
      { password: 0 }
    )

    if (userData) {
      const token = jwt.sign({ username: this.username }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRESIN
      })
      await User.updateOne({ username: this.username }, { token })
      return Result.success(
        await User.findOne({ username: this.username }, { password: 0 }).populate('collect')
      )
    } else {
      return Result.error(ERROR_INFO.BadAccount.code, ERROR_INFO.BadAccount.msg)
    }
  }

  @handleError
  async updateIntroduction(headers) {
    const token = getToken(headers)
    await User.updateOne({ token }, { introduction: xss(this.introduction) })
    const userData = await User.findOne({ token }, { introduction: 1 })
    return Result.success(userData)
  }

  @handleError
  async uploadAvatar(headers) {
    const avatarType = ['image/jpeg', 'image/png']
    if (!avatarType.includes(this.avatar.type)) {
      return Result.error(ERROR_INFO.InvalidFile.code, ERROR_INFO.InvalidFile.msg)
    }

    // 删除之前的头像
    const token = await getToken(headers)
    const userData = await User.findOne({ token })
    const username = userData.username
    const oldUploadPath = path.resolve(__dirname, `../public${userData.avatar}`)
    fs.unlinkSync(oldUploadPath)

    // 添加时间戳，以禁止缓存
    const avatarName = username + Date.now().toString() + path.extname(this.avatar.name)
    const uploadPath = path.resolve(__dirname, `../public/upload/${avatarName}`)
    const reader = fs.createReadStream(this.avatar.path)
    const writer = fs.createWriteStream(uploadPath)
    const avatar = `/upload/${avatarName}`

    reader.pipe(writer)
    await User.updateOne({ username }, { avatar })
    const _userData = await User.findOne({ username }, { avatar: 1 })
    return Result.success(_userData)
  }

  @handleError
  static async handleCollect(articleid, cancelCollect, headers) {
    const userId = await getUserId(headers)
    const _article = await Article.findOne({ _id: articleid, privated: false })
    const article = _article ? _article : await Article.findOne({ author: userId, _id: articleid })

    if (cancelCollect) {
      await User.update({ _id: userId }, { $pull: { collect: article._id } })
    } else {
      await User.update({ _id: userId }, { $addToSet: { collect: article._id } })
    }

    return Result.success(null)
  }
}
