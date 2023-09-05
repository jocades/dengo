import {
  Collection,
  DeleteOptions,
  Filter,
  // FindOptions,
  InsertDocument,
  InsertOptions,
  ObjectId,
  UpdateFilter,
  UpdateOptions,
} from 'deps'
import { dengo } from './dengo.ts'
import { parseObjectId } from './utils.ts'
import { FindCursor } from 'deps'
import { Document, FindOptions, Schema } from './types.ts'
import { FindQuery } from './commands/find.ts'

/**
 * Creates a new model instance for a MongoDB collection.
 * @param collectionName The name of the MongoDB collection.
 * @param schema The schema for the MongoDB collection.
 * @returns A new instance of the `Model` class.
 * @example
 * const userSchema = dengo.schema({
 *   name: str(),
 *   email: str().email(),
 *   age: coerce.num().min(18)
 * });
 * const User = dengo.model('users', userSchema);
 */
export function model<const T extends Schema>(
  collectionName: string,
  schema: T,
) {
  return new Model<T>(collectionName, schema)
}

/**
 * Represents a MongoDB collection model.
 * @template T The schema type for the MongoDB collection.
 */
export class Model<T extends Schema> {
  /**
   * The MongoDB connection.
   * @private @internal @readonly
   */
  #conn = dengo.conn

  /*
   * The MongoDB collection.
   */
  #collection: Collection<Document<T>>

  /**
   * The schema for the MongoDB collection.
   * Includes the schema definition and options.
   */
  schema: T

  /**
   * Creates a new instance of the `Model` class.
   * @param collectionName The name of the MongoDB collection.
   * @param schema The schema for the MongoDB collection.
   */
  constructor(collectionName: string, schema: T) {
    this.#collection = this.conn.db.collection(collectionName)
    this.schema = schema
  }

  /**
   * Finds documents in the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param options The options to apply to the query.
   * @param cb A callback function to handle each document returned by the query.
   * @returns An array of documents that match the query.
   */
  find(
    filter?: Filter<Document<T>>,
    options?: FindOptions<T>,
    // cb?: (data: Document<T> & Record<string, unknown>) => void,
  ) {
    return new FindQuery<T>(this.#collection, filter, options)
    // const iter = this.collection.find(filter, options)
    //
    // if (cb) {
    //   return this.handleMany(iter, cb)
    // }
    //
    // return iter.toArray()
  }

  /**
   * Finds a single document in the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param options The options to apply to the query.
   * @returns The first document that matches the query.
   */
  findOne(
    filter?: Filter<Document<T>>,
    options?: FindOptions<T>,
  ) {
    return this.collection.findOne(filter, options)
  }

  /**
   * Finds a document in the MongoDB collection by its ID.
   * @param id The ID of the document to find.
   * @param options The options to apply to the query.
   * @returns The document that matches the ID.
   */
  findById(
    id: string | ObjectId,
    options?: FindOptions,
  ) {
    // @ts-expect-error: cast objectId do document
    return this.findOne({ _id: parseObjectId(id) }, options)
  }

  /**
   * The MongoDB collection's `aggregate` method.
   */
  get aggregate() {
    return this.collection.aggregate
  }

  /**
   * Populates a document's references.
   */
  async populate() {}

  /**
   * Inserts a single document into the MongoDB collection.
   * Values are parsed and timestamps are added to the document.
   * @param doc The document to insert.
   * @param options The options to apply to the insert operation.
   * @returns The parsed document with its inserted ID.
   */
  async insertOne(
    doc: Document<T>,
    options?: InsertOptions,
  ) {
    const parsedDoc = this.schema.props.parse(doc)
    this.handleInsertTimestamps(parsedDoc)

    const _id = await this.collection.insertOne(
      parsedDoc as InsertDocument<Document<T>>,
      options,
    )

    return { ...parsedDoc, _id } as Document<T> & { _id: ObjectId }
  }

  /**
   * Inserts multiple documents into the MongoDB collection.
   * Values are parsed and timestamps are added to each document.
   * @param docs The documents to insert.
   * @param options The options to apply to the insert operation.
   * @returns The parsed documents with their inserted IDs.
   */
  async insertMany(
    docs: Document<T>[],
    options?: InsertOptions,
  ) {
    const parsedDocs = docs.map((doc) => {
      const parsedDoc = this.schema.props.parse(doc)
      this.handleInsertTimestamps(parsedDoc)
      return parsedDoc
    })

    const { insertedIds } = await this.collection.insertMany(
      parsedDocs as InsertDocument<Document<T>>[],
      options,
    )

    return parsedDocs.map((doc, i) => ({ ...doc, _id: insertedIds[i] }))
  }

  /**
   * Updates multiple documents in the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param update The update to apply to the documents.
   * @param options The options to apply to the update operation.
   * @returns The result of the update operation.
   */
  async updateOne(
    filter: Filter<Document<T>>,
    update: UpdateFilter<Document<T>>,
    options?: UpdateOptions,
  ) {
    const parsedDoc = this.schema.props
      .optional()
      .parse(update.$set) as Partial<Document<T>>

    this.handleUpdateTimestamps(parsedDoc)

    const { upsertedId } = await this.collection.updateOne(
      filter,
      update,
      options,
    )

    return { ...update, _id: upsertedId }
  }

  /**
   * Updates multiple documents in the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param update The update to apply to the documents.
   * @param options The options to apply to the update operation.
   * @returns The result of the update operation.
   */
  updateMany(
    filter: Filter<Document<T>>,
    update: UpdateFilter<Document<T>>,
    options?: UpdateOptions,
  ) {
    const parsedDoc = this.schema.props
      .optional()
      .parse(update.$set) as Partial<Document<T>>

    this.handleUpdateTimestamps(parsedDoc)

    return this.collection.updateMany(filter, parsedDoc, options)
  }

  /**
   * Finds a document in the MongoDB collection by its ID and updates it.
   * @param id The ID of the document to update.
   * @param update The update to apply to the document.
   * @param options The options to apply to the update operation.
   * @returns The result of the update operation.
   */
  findByIdAndUpdate(
    id: string | ObjectId,
    update: UpdateFilter<Document<T>>,
    options?: UpdateOptions,
  ) {
    this.schema.props.optional().parse(update)
    // @ts-expect-error: cast objectId do document
    return this.updateOne({ _id: parseObjectId(id) }, update, options)
  }

  /**
   * Replaces a single document in the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param doc The document to replace the matched document with.
   * @param options The options to apply to the replace operation.
   * @returns The result of the replace operation.
   */
  async replaceOne() {}

  /**
   * Finds a document in the MongoDB collection by its ID and replaces it.
   * @param id The ID of the document to replace.
   * @param doc The document to replace the matched document with.
   * @param options The options to apply to the replace operation.
   * @returns The result of the replace operation.
   */
  async findByIdAndReplace() {}

  /**
   * Deletes a single document from the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param options The options to apply to the delete operation.
   * @returns The result of the delete operation.
   */
  deleteOne(
    filter: Filter<Document<T>>,
    options?: DeleteOptions,
  ) {
    return this.collection.deleteOne(filter, options)
  }

  /**
   * Deletes multiple documents from the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param options The options to apply to the delete operation.
   * @returns The result of the delete operation.
   */
  deleteMany(
    filter: Filter<Document<T>>,
    options?: DeleteOptions,
  ) {
    return this.collection.deleteMany(filter, options)
  }

  /**
   * Finds a document in the MongoDB collection by its ID and deletes it.
   * @param id The ID of the document to delete.
   * @param options The options to apply to the delete operation.
   * @returns The result of the delete operation.
   */
  findByIdAndDelete(
    id: string | ObjectId,
    options?: DeleteOptions,
  ) {
    // @ts-expect-error: cast objectId do document
    return this.deleteOne({ _id: parseObjectId(id) }, options)
  }

  /**
   * Drops the MongoDB collection.
   * @returns The result of the drop operation.
   */
  dropCollection() {
    return this.collection.drop()
  }

  /**
   * Handles the result of a MongoDB query.
   * @param iter The MongoDB query iterator.
   * @param cb A callback function to handle each document returned by the query.
   * @returns An array of documents that match the query.
   */
  async handleMany(
    iter: FindCursor<Document<T>>,
    cb: (doc: Document<T>) => void,
  ) {
    const result: Document<T>[] = []
    await iter.forEach((doc) => {
      cb(doc)
      result.push(doc)
    })
    return result
  }

  /**
   * Adds timestamps to a document before inserting it into the MongoDB collection.
   * @param doc The document to insert into the MongoDB collection.
   */
  protected handleInsertTimestamps(
    doc: Record<string, unknown>,
  ) {
    if (this.schema.options.timestamps) {
      const createdAt = new Date()
      doc.createdAt = createdAt
      doc.updatedAt = createdAt
    }
  }

  /**
   * Adds timestamps to a document before updating it in the MongoDB collection.
   * @param update The update to apply to the document.
   */
  protected handleUpdateTimestamps(
    update: UpdateFilter<Record<string, unknown>>,
  ) {
    if (this.schema.options.timestamps) {
      update.$set = {
        ...update.$set,
        updatedAt: new Date(),
      }
    }
  }

  get conn() {
    if (!this.#conn) {
      throw new Error('No connection establised before query.')
    }
    return this.#conn
  }

  get collection() {
    if (!this.conn) {
      throw new Error('No connection establised before query.')
    }
    return this.#collection
  }
}
