import { dataTypes } from './data-types.ts'
import { DataType } from './types.ts'

type SchemaDefinition = Record<string, Field | DataType>

interface Field {
  type: DataType
  required?: boolean
  unique?: boolean
  default?: unknown
  validator?: (value: unknown) => boolean
}

const defaultFieldOptions = {
  type: undefined,
  required: false,
  unique: false,
  default: undefined,
  validator: undefined,
} satisfies Partial<Field>

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

export class Schema {
  schemaMap: Record<string, Field> = {}

  constructor(def: SchemaDefinition) {
    for (const prop in def) {
      if (typeof def[prop] === 'object' && def[prop] instanceof Schema) {
        this.schemaMap[prop] = def[prop] as Field
      } else if (typeof def[prop] === 'object') {
        this.schemaMap[prop] = parseField(def[prop] as Field)
      } else if (typeof def[prop] === 'string') {
        this.schemaMap[prop] = parseField({ type: def[prop] as DataType })
      }
    }
  }
}

function parseField(options: Field) {
  const field: Record<string, any> = {}

  for (const key in options) {
    if (key === 'type') {
      if (!(options.type in dataTypes)) {
        throw new Error(`Invalid field type: ${options.type}`)
      }
      field.type = dataTypes[options.type]
    } else if (key in defaultFieldOptions) {
      field[key] = options[key as keyof Field]
    }
  }

  return field as Field
}
