declare module 'express-serve-static-core' {
  export interface Response {
    badRequest(message?: string, err ?: Error): this;
    unauthorized(message?: string, err ?: Error): this;
    forbidden(message?: string, err ?: Error): this;
    notFound(message?: string, err ?: Error): this;
    internalServerError(message?: string, err ?: Error): this;
    serviceUnavailable(message?: string, err ?: Error): this;
  }
}
