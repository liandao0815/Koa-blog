import path from 'path'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import views from 'koa-views'
import favicon from 'koa-favicon'
import session from 'koa-session'
import { appKeys } from '../config/application'

export default app => {
  app.use(serve(path.resolve(__dirname, '../public/')))
  app.use(favicon(path.resolve(__dirname, '../public/favicon.ico')))
  app.use(views(path.resolve(__dirname, '../views/')))
  app.use(bodyparser())

  const sessionConf = { key: 'session_id' }
  app.keys = appKeys
  app.use(session(sessionConf, app))
}
