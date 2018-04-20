import fs from 'fs'
import path from 'path'

export default async app => {
  const files = fs
    .readdirSync(__dirname)
    .filter(file => file !== path.basename(__filename))

  for (const file of files) {
    const router = (await import(`./${file}`)).default
    app.use(router.routes()).use(router.allowedMethods())
  }
}
