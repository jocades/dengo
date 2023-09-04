import { ConnectOptions } from 'mongo'
import { Connection } from './connection.ts'
import { model } from './model.ts'
import { schema } from './schema.ts'

class Dengo {
  connection: Connection | null = null
  model = model
  schema = schema

  connect(options: ConnectOptions | string) {
    this.connection = new Connection(options)
    return this.connection.connect()
  }

  disconnect() {
    if (!this.connection) {
      throw new Error('No connection to disconnect.')
    }
    this.connection.disconnect()
    this.connection = null
  }
}

export const dengo: Dengo = new Dengo()
