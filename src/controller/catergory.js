import Router from 'koa-router'
import CategoryService from '../service/category'

const router = new Router({ prefix: '/api/category' })

router.post('/create', async ctx => {
  const category = new CategoryService(ctx.request.body)
  ctx.body = await category.create(ctx.headers)
})

router.get('/query', async ctx => {
  const category = new CategoryService(ctx.query)
  ctx.body = await category.query(ctx.headers)
})

router.post('/delete', async ctx => {
  const category = new CategoryService(ctx.request.body)
  ctx.body = await category.delete(ctx.headers)
})

router.post('/modify', async ctx => {
  const category = new CategoryService(ctx.request.body)
  ctx.body = await category.modify(ctx.headers)
})

export default router
