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
import { MappedSchema, Schema } from './schema.ts'
import { parseId } from './utils.ts'

interface Extended extends Document {
  createdAt: Date
  updatedAt: Date
}

export class Query<T extends Schema> {
  #connection = dengo.connection
  collection: Collection<MappedSchema<T>>
  updateQuery: Record<string, unknown> = {}

  constructor(public collectionName: string, public schema: Schema) {
    this.collection = this.connection.db.collection(collectionName)
  }

  // READ
  async find(
    filter?: Filter<T>,
    options?: FindOptions,
    cb?: (data?: InsertDocument<T>) => void,
  ) {
    const iter = this.collection.find(filter, options)

    if (cb) {
      await iter.forEach(cb)
    }

    return iter.toArray()
  }

  async findOne(
    filter?: Filter<MappedSchema<T>>,
    options?: FindOptions,
    cb?: (data?: InsertDocument<T>) => void,
  ) {
    const data = await this.collection.findOne(filter, options)
    cb?.(data)
    return data
  }

  findById(
    id: string | ObjectId,
    options?: FindOptions,
    cb?: (data?: InsertDocument<T>) => void,
  ) {
    return this.findOne({ _id: parseId(id) }, options, cb)
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
