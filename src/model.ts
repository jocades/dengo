import { Query } from './query.ts'
import { Schema } from './schema.ts'

export function model(collection: string, schema: Schema) {
  return new Model(collection, schema)
}

class Model extends Query {
  constructor(collection: string, schema: Schema) {
    super(collection, schema)
  }
}
