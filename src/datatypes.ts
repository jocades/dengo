import { any, custom, literal, object, unknown, z, zCoerce } from 'deps'
import { ObjectId } from 'deps'

export const str = z.string
export const num = z.number
export const bool = z.boolean
export const date = z.date
export const enu = z.enum
export const list = z.array
export const objectId = () => str().refine(ObjectId.isValid)
export const location = () =>
  object({
    type: literal('Point'),
    coordinates: list(num()).length(2),
  })
// other BSON types?

const coerce = {
  str: zCoerce.string,
  num: zCoerce.number,
  bool: zCoerce.boolean,
  date: zCoerce.date,
}
// create a custom instance of zod called t and map string to str, etc.

export const t = {
  any,
  custom,
  literal,
  object,
  unknown,
  str,
  num,
  bool,
  date,
  enu,
  list,
  objectId,
  location,
  coerce,
}
