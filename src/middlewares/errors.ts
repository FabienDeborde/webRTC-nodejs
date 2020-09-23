import { RequestHandler } from 'express'

const formatResponse = (code: number, message: string, error ?: Error) => {
  return {
    code,
    message,
    error: process.env.NODE_ENV !== 'production' ? error : null
  }
}

export const errorMiddleware: RequestHandler = (req, res, next) => {
  res.badRequest = function (message, err) {
    return this.status(400).send(formatResponse(400, message || 'Bad Request', err))
  }
  res.unauthorized = function (message, err) {
    return this.status(401).send(formatResponse(401, message || 'Unauthorized', err))
  }
  res.forbidden = function (message, err) {
    return this.status(403).send(formatResponse(403, message || 'Forbidden', err))
  }
  res.notFound = function (message, err) {
    return this.status(404).send(formatResponse(404, message || 'Not Found', err))
  }
  res.internalServerError = function (message, err) {
    return this.status(500).send(formatResponse(500, message || 'Internal Server Error', err))
  }
  res.serviceUnavailable = function (message, err) {
    return this.status(503).send(formatResponse(503, message || 'Service Unavailable', err))
  }

  next()
}
