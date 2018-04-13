import base from './base'
import logger from './logger'
import cors from './cors'
import redirect from './redirect'

export default app => {
  base(app)
  cors(app)
  logger(app)
  redirect(app)
}
