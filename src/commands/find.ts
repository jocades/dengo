import { Collection, Filter } from 'deps'
import { Document, FindOptions, Schema, SelectOptions } from '../types.ts'

export class FindQuery<T extends Schema> {
  #options: FindOptions<T> = {}

  constructor(
    private collection: Collection<Document<T>>,
    private filter?: Filter<Document<T>>,
    options: FindOptions<T> = {},
  ) {
    this.#options = options
  }

  limit(limit: number): this {
    this.#options.limit = limit
    return this
  }

  skip(skip: number): this {
    this.#options.skip = skip
    return this
  }

  sort(sort: Document<T>): this {
    this.#options.sort = sort
    return this
  }

  select(fields: SelectOptions<T>): this {
    if (Array.isArray(fields)) {
      const projection = fields.reduce((acc, field) => {
        if (field.startsWith('-')) {
          acc[field.slice(1)] = 0
        } else {
          acc[field] = 1
        }

        return acc
      }, {} as Record<string, 0 | 1>)

      this.#options.projection = projection
    } else {
      this.#options.projection = fields
    }

    return this
  }

  async exec(): Promise<Document<T>[]> {
    const iter = this.collection.find(this.filter, this.#options)
    // do something with iter...

    const result = await iter.toArray()
    this.#options = {}

    return result
  }
}
