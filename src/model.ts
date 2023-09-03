import { Query } from './query.ts'

import {
  Collection,
  Document,
  Filter,
  FindOptions,
  InsertDocument,
  InsertOptions,
  ObjectId,
} from 'mongo'
import { dengo } from './dengo.ts'
import { MappedSchema, Schema, SchemaDefinition } from './schema.ts'
import { parseId } from './utils.ts'

export function _model<T extends SchemaDefinition>(
  collection: string,
  schema: Schema<T>,
) {
  return new Model<T>(collection, schema)
}

class Model<T extends SchemaDefinition> {
  #connection = dengo.connection
  collection: Collection<MappedSchema<T>>
  updateQuery: Record<string, unknown> = {}

  constructor(public collectionName: string, public schema: Schema<T>) {
    this.collection = this.connection.db.collection(collectionName)
  }

  // READ
  find(
    filter?: Filter<T>,
    options?: FindOptions,
    // cb?: (data?: InsertDocument<T>) => void,
  ) {
    const iter = this.collection.find(filter, options)

    // if (cb) {
    //   await iter.forEach(cb)
    // }

    return iter.toArray()
  }

  async findOne(
    filter?: Filter<MappedSchema<T>>,
    options?: FindOptions,
    // cb?: (data?: InsertDocument<T>) => void,
  ) {
    const data = await this.collection.findOne(filter, options)
    // cb?.(data)
    return data
  }

  findById(
    id: string | ObjectId,
    options?: FindOptions,
    // cb?: (data?: InsertDocument<T>) => void,
  ) {
    return this.findOne({ _id: parseId(id) }, options)
  }

  async aggregate() {}

  async populate() {}

  // WRITE
  async insertOne(doc: InsertDocument<T>, options?: InsertOptions) {
    const id = await this.collection.insertOne(doc, options)
    return id
  }

  async insertMany() {}

  // UPDATE
  async updateOne() {}

  async updateMany() {}

  async findByIdAndUpdate() {}

  // REPLACE
  async replaceOne() {}

  async findByIdAndReplace() {}

  // DELETE
  async deleteOne() {}

  async deleteMany() {}

  async findByIdAndDelete() {}

  async dropCollection() {}

  protected get connection() {
    if (!this.#connection) {
      throw new Error('No connection establised before query.')
    }
    return this.#connection
  }
}
