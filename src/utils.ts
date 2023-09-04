import { ObjectId } from 'deps'

export function parseObjectId(id: string | ObjectId) {
  return id instanceof ObjectId ? id : new ObjectId(id)
}
