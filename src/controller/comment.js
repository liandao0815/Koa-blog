import Router from 'koa-router'
import commentService from '../service/comment'

const router = new Router({ prefix: '/api/comment' })

router.post('/commit', async ctx => {
  const { articleid, content } = ctx.request.body
  ctx.body = await commentService.commit(articleid, content, ctx.headers)
})

export default router
