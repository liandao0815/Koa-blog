import Router from 'koa-router'
import UserService from '../service/user'

const router = new Router({ prefix: '/api/user' })

router.get('/info', async ctx => {
  ctx.body = await UserService.getUserInfo(ctx.headers)
})

router.post('/register', async ctx => {
  const user = new UserService(ctx.request.body)
  ctx.body = await user.register()
})

router.post('/login', async ctx => {
  const user = new UserService(ctx.request.body)
  ctx.body = await user.login()
})

router.post('/introduction', async ctx => {
  const user = new UserService(ctx.request.body)
  ctx.body = await user.updateIntroduction(ctx.headers)
})

router.post('/avatar', async ctx => {
  const { avatar } = ctx.request.body.files
  const user = new UserService({ avatar })
  ctx.body = await user.uploadAvatar(ctx.headers)
})

router.post('/collect', async ctx => {
  const { articleid, cancelCollect } = ctx.request.body
  ctx.body = await UserService.handleCollect(
    articleid,
    cancelCollect,
    ctx.headers,
  )
})

export default router
