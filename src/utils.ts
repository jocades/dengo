import { ObjectId } from 'mongo'

export function parseObjectId(id: string | ObjectId) {
  return id instanceof ObjectId ? id : new ObjectId(id)
}
