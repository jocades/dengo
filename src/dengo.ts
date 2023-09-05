import { ConnectOptions } from 'deps'
import { Connection } from './connection.ts'
import { model } from './model.ts'
import { schema } from './schema.ts'

class Dengo {
  conn: Connection | null = null
  model = model
  schema = schema

  connect(options: ConnectOptions | string) {
    this.conn = new Connection(options)
    return this.conn.connect()
  }

  disconnect() {
    if (!this.conn) {
      throw new Error('No connection to disconnect.')
    }
    this.conn.disconnect()
    this.conn = null
  }
}

export const dengo: Dengo = new Dengo()
