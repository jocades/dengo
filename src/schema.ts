import { object } from './datatypes.ts'
import { Schema, SchemaDefinition, SchemaOptions } from './types.ts'

export function schema<T extends SchemaDefinition>(
  def: T,
  options: SchemaOptions = {},
) {
  return {
    props: object(def),
    options,
  } satisfies Schema<T>
}
