import {
  Collection,
  DeleteOptions,
  Filter,
  FindOptions,
  InsertDocument,
  InsertOptions,
  ObjectId,
  UpdateFilter,
  UpdateOptions,
} from 'deps'
import { dengo } from './dengo.ts'
import { parseObjectId } from './utils.ts'
import { FindCursor } from 'deps'
import { Document, Schema } from './types.ts'

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
  #connection = dengo.connection

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
    this.#collection = this.connection.db.collection(collectionName)
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
    options?: FindOptions,
    cb?: (data: Document<T> & Record<string, unknown>) => void,
  ) {
    const iter = this.collection.find(filter, options)

    if (cb) {
      return this.handleMany(iter, cb)
    }

    return iter.toArray()
  }

  /**
   * Finds a single document in the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param options The options to apply to the query.
   * @returns The first document that matches the query.
   */
  findOne(
    filter?: Filter<Document<T>>,
    options?: FindOptions,
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
   * @param doc The document to insert.
   * @param options The options to apply to the insert operation.
   * @returns The result of the insert operation.
   */
  insertOne(
    doc: InsertDocument<Document<T>>,
    options?: InsertOptions,
  ) {
    this.schema.props.parse(doc)

    if (this.schema.options?.timestamps) {
      const createdAt = new Date()
      doc.createdAt = createdAt
      doc.updatedAt = createdAt
    }

    return this.collection.insertOne(doc, options)
  }

  /**
   * Inserts multiple documents into the MongoDB collection.
   * @param docs The documents to insert.
   * @param options The options to apply to the insert operation.
   * @returns The result of the insert operation.
   */
  insertMany(
    docs: InsertDocument<Document<T>>[],
    options?: InsertOptions,
  ) {
    docs.forEach((doc) => {
      this.schema.props.parse(doc)

      if (this.schema.options?.timestamps) {
        const createdAt = new Date()
        doc.createdAt = createdAt
        doc.updatedAt = createdAt
      }
    })

    return this.collection.insertMany(docs, options)
  }

  /**
   * Updates multiple documents in the MongoDB collection.
   * @param filter The filter to apply to the query.
   * @param update The update to apply to the documents.
   * @param options The options to apply to the update operation.
   * @returns The result of the update operation.
   */
  updateOne(
    filter: Filter<Document<T>>,
    update: UpdateFilter<Document<T>>,
    options?: UpdateOptions,
  ) {
    this.schema.props.optional().parse(update)

    if (this.schema.options?.timestamps) {
      update = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date(),
        },
      }
    }

    return this.collection.updateOne(filter, update, options)
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
    this.schema.props.optional().parse(update)

    if (this.schema.options?.timestamps) {
      update = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date(),
        },
      }
    }

    return this.collection.updateMany(filter, update, options)
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
  private async handleMany(
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

  get connection() {
    if (!this.#connection) {
      throw new Error('No connection establised before query.')
    }
    return this.#connection
  }

  get collection() {
    if (!this.connection) {
      throw new Error('No connection establised before query.')
    }
    return this.#collection
  }
}
