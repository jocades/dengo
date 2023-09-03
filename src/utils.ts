import { ObjectId } from 'mongo'
import { DengoDataType } from './types.ts'
import { FieldDefinition } from './schema.ts'
import { dataTypes } from './data-types.ts'

export function parseId(id: string | ObjectId) {
  return id instanceof ObjectId ? id : new ObjectId(id)
}

export function isDengoDataType(value: unknown): value is DengoDataType {
  return typeof value === 'string' && value in dataTypes
}

export function isFieldDefinition(value: unknown): value is FieldDefinition {
  return value !== null && typeof value === 'object' && 'type' in value &&
    isDengoDataType((value as FieldDefinition).type)
}
