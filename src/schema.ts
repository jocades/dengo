import { Data } from 'https://deno.land/std@0.154.0/crypto/mod.ts'
import { DengoDataTypeToPrimitive } from '../internal/typescript.ts'
import { dataTypes } from './data-types.ts'
import { DengoDataType, DengoTransformer } from './types.ts'
import { isDengoDataType, isFieldDefinition } from './utils.ts'
import { dengo } from './dengo.ts'

// What i am trying to achieve:
// const userSchmea = dengo.schema({
//     name: 'string',
//     age: {
//         type: 'number',
//         required: true,
//         validator: (value) => {
//             return value > 0
//         },
//     book: bookSchema
// })
//
// const User = dengo.model('users', userSchema)

type DataTypeMap = {
  string: string
  number: number
  decimal128: number
  boolean: boolean
  object: Record<string, unknown>
  date: Date
  objectid: string
  uuid: string
}

type MappedType<T extends DengoDataType> = T extends keyof DataTypeMap
  ? DataTypeMap[T]
  : never

type MappedField<T extends FieldDefinition> = {
  [K in keyof T]: K extends 'type' ? MappedType<T[K]> : never
}

export type MappedSchema<T extends SchemaDefinition> =
  & {
    [K in keyof T]: T[K] extends DengoDataType ? MappedType<T[K]>
      : T[K] extends FieldDefinition ? MappedType<T[K]['type']>
      // : T[K] extends SchemaDefinition ? MappedSchema<T[K]> TODO nested schemas
      : never
  }
  & {
    _id: string
    createdAt: Date
    updatedAt: Date
  }

export type SchemaDefinition = Record<string, DengoDataType | FieldDefinition>

export type Schema<T extends SchemaDefinition> = {
  [K in keyof T]: Field
}

export interface SchemaOptions {
  timestamps?: boolean
}

export interface FieldDefinition
  extends Pick<Field, 'required' | 'unique' | 'default' | 'validator'> {
  type: DengoDataType
}

// export type Schema<T extends SchemaDefinition> = {
//   [K in keyof T]: T[K] extends SchemaDefinition ? Schema<T[K]>
//     : T[K] extends DataType ? DataTypeMap[T[K]]
//     : T[K] extends FieldDefinition
//       ? MappedFieldDefinition<T[K]> & { type: MappedType<T[K]['type']> }
//     : never
// }

class Field {
  type!: DengoTransformer
  required?: boolean
  unique?: boolean
  default?: unknown
  validator?: (value: unknown) => unknown

  constructor(fieldDef: FieldDefinition) {
    for (const key in fieldDef) {
      if (key === 'type') {
        this.type = dataTypes[fieldDef.type]
      } else if (key in this) {
        // @ts-expect-error: cannot cast def to field
        this[key] = fieldDef[key]
      } else {
        throw new Error(`Invalid field definition: ${key}.`)
      }
    }
  }
}

export function _createSchema<const T extends SchemaDefinition>(
  def: T,
  options?: SchemaOptions,
) {
  return Object.fromEntries(
    Object.entries(def).map(([key, value]) => {
      if (isDengoDataType(value)) {
        return [key, new Field({ type: value })]
      }

      if (isFieldDefinition(value)) {
        return [key, new Field(value)]
      }

      throw new Error(`Invalid field definition for ${key}.`)
    }),
  ) as Schema<T>
}

const userSchema = _createSchema({
  name: 'string',
  age: {
    type: 'number',
    required: true,
  },
})

console.log(userSchema)

const User = dengo.model('users', userSchema)

const user = (await User.findOne())!

console.log(user.age)
