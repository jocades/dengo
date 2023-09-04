// deno-lint-ignore-file ban-types

import { ObjectId } from 'mongo'
import { z, ZodObject, ZodTypeAny } from 'zod'

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
  & { _id?: ObjectId }
  & (
    T['options']['timestamps'] extends true ? {
        createdAt: Date
        updatedAt: Date
      }
      : {}
  )

export { ObjectId }
