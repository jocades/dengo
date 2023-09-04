import { AnyZodObject, object, ZodTypeAny } from 'zod/mod.ts'
import { bool, coerce, enu, list, objectId, str } from '../src/datatypes.ts'
import { dengo } from '../src/dengo.ts'
import { Document, SchemaDefinition } from '../src/types.ts'
import { schema } from '../src/schema.ts'
import { model } from '../mod.ts'

type Schema<T extends SchemaDefinition> = {
  [K in keyof T]: T[K] extends ZodTypeAny ? T[K] : AnyZodObject
}

await dengo.connect('mongodb://localhost:27017/dengo')

const userSchema = schema({
  name: str(),

  age: coerce.num().min(18),

  address: object({
    street: str(),
    city: str(),
  }),

  plan: enu(['free', 'premium']).default('free'),

  friend: objectId(),

  pets: list(str()),

  isAdmin: bool().default(false),
}, {
  timestamps: true,
})

type IUser = Document<typeof userSchema>

const data: IUser = {
  // _id: '64f4aae0e936f103e04dfb3e',
  name: 'joe',
  age: 18,
  address: {
    street: '123 main st',
    city: 'san francisco',
  },
  pets: ['dog', 'cat'],
  friend: '64f4aae0e936f103e04dfb3e',
  isAdmin: true,
}

// const user = userSchema.props.parse(data)
// console.log(user)

const User = model('users', userSchema)

const userId = await User.insertOne(data)
console.log(userId)

const users = await User.find()
console.log(users)
