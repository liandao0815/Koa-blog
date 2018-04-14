import jwt from 'jsonwebtoken'
import Crypto from '../utils/crypto'
import { User } from '../database/model'
import { TOKEN_SECRET, PASSWORD_SALT } from '../config/appConf'
import Result, { ERROR_INFO } from '../utils/result'

export default class UserService {
  static async register(username, password) {
    let userData = await User.findOne({ username })
    if (userData) {
      return Result.error(
        ERROR_INFO.ExistAccount.code,
        ERROR_INFO.ExistAccount.msg
      )
    } else {
      let token = jwt.sign({ username }, TOKEN_SECRET, { expiresIn: '1d' })
      let crypto = new Crypto(PASSWORD_SALT, password)
      let user = new User({ username, password: crypto.encrypt(), token })

      await user.save()
      return Result.success({ username, token })
    }
  }

  static async login(username, password) {
    let crypto = new Crypto(PASSWORD_SALT, password)
    let userData = await User.findOne(
      { username, password: crypto.encrypt() },
      { password: 0 }
    )

    if (userData === null) {
      return Result.error(ERROR_INFO.BadAccount.code, ERROR_INFO.BadAccount.msg)
    } else {
      return Result.success(userData)
    }
  }
}
