import jwt from 'jsonwebtoken'
import { User } from '../database/model'
import { TOKEN_SECRET } from '../config/appConf'
import Result, { ERROR_INFO } from '../utils/result'

export default app => {
  app.use(async (ctx, next) => {
    let reg = /(login|register)/i
    if (ctx.method === 'GET' || reg.test(ctx.url)) {
      await next()
    } else {
      const token = ctx.headers.Authorization
        ? ctx.headers.Authorization.split(' ')[1]
        : ''
      const userInfo = await User.findOne({ token })

      if (userInfo === null) {
        ctx.status = 401
        ctx.body = Result.error(ERROR_INFO.NoToken.code, ERROR_INFO.NoToken.msg)
      } else {
        try {
          jwt.verify(userInfo.token, TOKEN_SECRET)
          await next()
        } catch (error) {
          ctx.status = 401
          ctx.body = Result.error(
            ERROR_INFO.InvalidToken.code,
            ERROR_INFO.InvalidToken.msg
          )
        }
      }
    }
  })
}
