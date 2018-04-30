import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import xss from 'xss'
import Crypto from '../utils/crypto'
import { User, Article } from '../database/model'
import {
  TOKEN_SECRET,
  TOKEN_EXPIRESIN,
  PASSWORD_SALT
} from '../config/application'
import Result, { ERROR_INFO } from '../utils/result'
import { getToken, getUsername } from '../utils/roles'
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
  async register() {
    const userData = await User.findOne({ username: this.username })
    if (userData) {
      return Result.error(
        ERROR_INFO.ExistAccount.code,
        ERROR_INFO.ExistAccount.msg
      )
    } else if (this.username.length > 10) {
      return Result.error(
        ERROR_INFO.BeyondLength.code,
        ERROR_INFO.BeyondLength.msg
      )
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
        await User.findOne({ username: this.username }, { password: 0 })
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
        await User.findOne({ username: this.username }, { password: 0 })
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

    const username = await getUsername(headers)
    const avatarName = `${username}${path.extname(this.avatar.name)}`
    const uploadPath = path.resolve(__dirname, `../public/upload/${avatarName}`)
    const reader = fs.createReadStream(this.avatar.path)
    const writer = fs.createWriteStream(uploadPath)
    const avatar = `/upload/${avatarName}`

    reader.pipe(writer)
    await User.updateOne({ username }, { avatar })
    const userData = await User.findOne({ username }, { avatar: 1 })
    return Result.success(userData)
  }

  @handleError
  static async handleCollect(articleid, headers) {
    const token = getToken(headers)
    const article = await Article.findOne({
      _id: articleid,
      privated: false
    })
    await User.update({ token }, { $addToSet: { collect: article._id } })
    return Result.success(null)
  }
}
