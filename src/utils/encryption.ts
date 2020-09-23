import bcrypt from 'bcryptjs'
import CryptoJS from 'crypto-js'

const salt = bcrypt.genSaltSync(10)
const key = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'utf8').toString('hex')

export const hash = (string: string): string => {
  return bcrypt.hashSync(string, salt)
}
export const compareHash = (string: string, hash: string): boolean => {
  return bcrypt.compareSync(string, hash)
}

export const encrypt = (string: string): string => {
  return CryptoJS.AES.encrypt(string, key).toString()
}
export const decrypt = (string: string): any => {
  const bytes = CryptoJS.AES.decrypt(string, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}
