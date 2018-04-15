import Router from 'koa-router'
import UserService from '../service/userService'

const router = new Router({ prefix: '/api/user' })

router.post('/register', async ctx => {
  const { username, password } = ctx.request.body
  ctx.body = await UserService.register(username, password)
})

router.post('/login', async ctx => {
  const { username, password } = ctx.request.body
  ctx.body = await UserService.login(username, password)
})

export default router
