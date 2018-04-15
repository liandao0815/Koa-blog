import Koa from 'koa'
import middleware from './middleware'
import controller from './controller'
import { HOST, PORT } from './config/application'

const app = new Koa()

middleware(app)

controller(app)

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})
