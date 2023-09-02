import { ConnectOptions, type Database, MongoClient } from 'mongo'

class ConnectionError extends Error {
  message = 'Database connection failed.'

  constructor(message?: string) {
    super()
    this.name = 'ConnectionError'
    if (message) {
      this.message = `${this.message} ${message}`
    }
  }
}

export class Connection {
  #client: MongoClient
  #db: Database | null
  connected: boolean

  constructor(private options: ConnectOptions | string) {
    this.#client = new MongoClient()
    this.#db = null
    this.connected = false
  }

  async connect() {
    try {
      this.#db = await this.#client.connect(this.options)
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

const conn = new Connection('mongodb://localhost:27017')
conn.connect()
conn.db.collection('users').find()
