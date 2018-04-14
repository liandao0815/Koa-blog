import logger from './logger'
import cors from './cors'
import token from './token'
import vendor from './vendor'
import fallback from './fallback'

export default app => {
  const modules = [logger, cors, token, vendor, fallback]
  modules.forEach(item => item(app))
}
