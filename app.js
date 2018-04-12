import Koa from 'koa'
import middleware from './middleware'
import { HOST, PORT } from './config/application'

const app = new Koa()

middleware(app)

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})
