import { getClientIp } from '@supercharge/request-ip'
import { RequestHandler } from 'express'

export const ipMiddleware: RequestHandler = (req, res, next) => {
  req.clientIP = getClientIp(req)
  next()
}
