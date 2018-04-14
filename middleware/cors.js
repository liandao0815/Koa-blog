export default app => {
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Origin, X-Requested-With, Content-Type, Accept, Authorization')
    ctx.set('Access-Control-Allow-Credentials', true)
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE')
    await next()
  })
}
