import {
  any,
  coerce as zCoerce,
  custom,
  literal,
  object,
  unknown,
  z,
} from 'zod'
import { ObjectId } from 'mongo'

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

export const coerce = {
  str: zCoerce.string,
  num: zCoerce.number,
  bool: zCoerce.boolean,
  date: zCoerce.date,
}

export { any, custom, literal, object, unknown, z }
