import Router from 'koa-router'
import ArticleService from '../service/article'

const router = new Router({ prefix: '/api/article' })

router.post('/publish', async ctx => {
  const article = new ArticleService(ctx.request.body)
  ctx.body = await article.publish(ctx.headers)
})

router.get('/search', async ctx => {
  const { q } = ctx.query
  ctx.body = await ArticleService.search(q)
})

router.post('/delete', async ctx => {
  const article = new ArticleService(ctx.request.body)
  ctx.body = await article.delete(ctx.headers)
})

router.post('/update', async ctx => {
  const article = new ArticleService(ctx.request.body)
  ctx.body = await article.update(ctx.headers)
})

router.get('/select', async ctx => {
  const article = new ArticleService(ctx.query)
  ctx.body = await article.select(ctx.query.commit, ctx.headers)
})

router.get('/query', async ctx => {
  const { pageSize, currentPage } = ctx.query
  ctx.body = await ArticleService.query(pageSize, currentPage)
})

router.get('/userArticle', async ctx => {
  ctx.body = await ArticleService.userArticle(ctx.headers)
})

export default router
