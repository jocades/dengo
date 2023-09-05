import { t } from './datatypes.ts'
import { Schema, SchemaDefinition, SchemaOptions } from './types.ts'

export function schema<T extends SchemaDefinition>(
  def: T | ((v: typeof t) => T),
  options: SchemaOptions = {},
) {
  if (typeof def === 'function') {
    def = def(t)
  }

  return {
    props: t.object(def),
    options,
  } satisfies Schema<T>
}
