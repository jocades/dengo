import { ConnectOptions } from 'mongo'
import { Connection } from './connection.ts'
import { dataTypes } from './data-types.ts'

class Dengo {
  connection: Connection | null = null
  types = dataTypes

  async connect(options: ConnectOptions | string) {
    this.connection = new Connection(options)
    await this.connection.connect()
    return this.connection
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
