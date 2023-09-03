import { ConnectOptions } from 'mongo'
import { Connection } from './connection.ts'
import { dataTypes } from './data-types.ts'
import { _model } from './model.ts'
import { _createSchema } from './schema.ts'

class Dengo {
  connection: Connection | null = null
  types = dataTypes
  schema = _createSchema
  model = _model

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

  // TODO: implement
  transaction() {}
}

export const dengo: Dengo = new Dengo()
