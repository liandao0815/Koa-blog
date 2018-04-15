import logger from './logger'
import cors from './cors'
import token from './token'
import vendor from './vendor'
import fallback from './fallback'

export default app => {
  const middlewares = [logger, cors, token, vendor, fallback]
  middlewares.forEach(item => item(app))
}
