import path from 'path'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import favicon from 'koa-favicon'
import session from 'koa-session'
import compress from 'koa-compress'
import { appKeys } from '../config/application'

export default app => {
  app.use(serve(path.resolve(__dirname, '../public/')))
  app.use(favicon(path.resolve(__dirname, '../public/favicon.ico')))
  app.use(bodyparser())
  app.use(compress())

  const sessionConf = { key: 'session_id' }
  app.keys = appKeys
  app.use(session(sessionConf, app))
}
