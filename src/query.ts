import { Connection } from './connection.ts'
import { dengo } from './dengo.ts'
import { Schema } from './schema.ts'

export class Query {
  #connection = dengo.connection
  updateQuery: Record<string, unknown> = {}

  constructor(public collection: string, public schema: Schema) {}

  // read
  async find() {}

  async findOne() {}

  async findById() {}

  async aggregate() {}

  async populate() {}

  // write
  async insertOne() {}

  async insertMany() {}

  // update
  async updateOne() {}

  async updateMany() {}

  async findByIdAndUpdate() {}

  // replace
  async replaceOne() {}

  async findByIdAndReplace() {}

  // delete
  async deleteOne() {}

  async deleteMany() {}

  async findByIdAndDelete() {}

  protected get connection() {
    if (!this.connection) {
      throw new Error('No connection to database.')
    }
    return this.#connection
  }
}
