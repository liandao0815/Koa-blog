import mongoose from 'mongoose'
import { dbUrl, dbUser, dbPassword } from '../config/dbConf'

mongoose.Promise = global.Promise

mongoose
  .connect(dbUrl, {
    user: dbUser,
    pass: dbPassword
  })
  .then(() => {
    console.log('Database connection is successful!')
  })
  .catch(() => {
    console.error('Database connection is failed!')
  })

export default mongoose
