import fs from 'fs'
import path from 'path'

export default async app => {
  let files = fs
    .readdirSync(__dirname)
    .filter(file => file !== path.basename(__filename))

  for (const file of files) {
    let router = (await import(`./${file}`)).default
    app.use(router.routes()).use(router.allowedMethods())
  }
}
