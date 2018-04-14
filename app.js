import Koa from 'koa'
import middleware from './middleware'
import router from './router'
import { HOST, PORT } from './config/appConf'

const app = new Koa()

middleware(app)

router(app)

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})
