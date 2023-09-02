export class ConnectionError extends Error {
  message = 'Database connection failed.'

  constructor(message?: string) {
    super()
    this.name = 'ConnectionError'
    if (message) {
      this.message = `${this.message} ${message}`
    }
  }
}
