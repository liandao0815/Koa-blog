import { User } from '../database/model'

export function getToken(headers) {
  return headers.authorization ? headers.authorization.split(' ')[1] : ''
}

export async function getUserId(headers) {
  const token = getToken(headers)
  const userData = await User.findOne({ token })
  return userData._id
}
