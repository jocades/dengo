import { ConnectOptions, type Database, MongoClient } from 'mongo'
import { ConnectionError } from './errors.ts'

export class Connection {
  #client: MongoClient = new MongoClient()
  #options: ConnectOptions | string
  #db: Database | null = null
  connected = false

  constructor(options: ConnectOptions | string) {
    this.#options = options
  }

  async connect() {
    try {
      this.#db = await this.#client.connect(this.#options)
      this.connected = true
      return this.#db
    } catch (err) {
      throw new ConnectionError(err.message || err)
    }
  }

  disconnect() {
    if (!this.connected) {
      throw new ConnectionError()
    }
    this.#client.close()
    this.connected = false
    this.#db = null
  }

  get db() {
    if (!this.#db) {
      throw new ConnectionError()
    }
    return this.#db
  }
}
