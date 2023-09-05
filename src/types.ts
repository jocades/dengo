import { ObjectId } from 'deps'
import { z, ZodObject, ZodTypeAny } from 'deps'

export type SchemaDefinition = Record<string, ZodTypeAny>

export type SchemaOptions = {
  timestamps?: boolean
}

export type Schema<T extends SchemaDefinition = SchemaDefinition> = {
  props: ZodObject<T>
  options: SchemaOptions
}

export type Document<T extends Schema> =
  & z.infer<T['props']>
  & { _id: ObjectId }
// & (
//   T['options']['timestamps'] extends true ? {
//       createdAt: Date
//       updatedAt: Date
//     }
//     : {}
// )

export type Selector<T extends Schema> = {
  [K in keyof Document<T>]?: 1 | 0
}

export type SelectorKeys<T extends Schema> =
  | Extract<keyof Document<T>, string>
  | `-${Extract<keyof Document<T>, string>}`

export type SelectOptions<T extends Schema> = Selector<T> | SelectorKeys<T>[]

export type FindOptions<T extends Schema = Schema> = {
  findOne?: boolean
  skip?: number
  limit?: number
  projection?: Selector<T>
  sort?: Selector<T>
  noCursorTimeout?: boolean
  /**
   * The maximum time of milliseconds the operation is allowed to take
   */
  maxTimeMS?: number
}
