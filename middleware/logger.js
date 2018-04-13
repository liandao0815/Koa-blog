import log4js from 'log4js'
import log4jsConf from '../config/loggerConf'

log4js.configure({ ...log4jsConf })

const httpLogger = log4js.getLogger('http')
const errorLogger = log4js.getLogger('error')

export default app => {
  app.use(async (ctx, next) => {
    const { method, url, host, headers } = ctx
    const httpInfo = {
      method,
      url,
      host,
      referer: headers['referer'],
      userAgent: headers['user-agent']
    }
    httpLogger.info(JSON.stringify(httpInfo))
    await next()
  })

  app.on('error', err => {
    errorLogger.error(err)
  })
}
