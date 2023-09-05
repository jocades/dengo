import { AnyZodObject, object, ZodTypeAny } from 'deps'
import { dengo } from '../src/dengo.ts'
import { Document, SchemaDefinition } from '../src/types.ts'
import { schema } from '../src/schema.ts'
import { model } from '../mod.ts'

type Schema<T extends SchemaDefinition> = {
  [K in keyof T]: T[K] extends ZodTypeAny ? T[K] : AnyZodObject
}

const db = await dengo.connect('mongodb://localhost:27017/dengo')

const userSchema = schema((t) => ({
  name: t.str(),

  age: t.coerce.num().min(18),

  address: t.object({
    street: t.str(),
    city: t.str(),
  }),

  plan: t.enu(['free', 'premium']).default('free'),

  friend: t.objectId(),

  pets: t.list(t.str()),

  isAdmin: t.bool().default(false),
}), { timestamps: true })

const User = dengo.model('user', userSchema)

type IUser = Document<typeof userSchema>

const data: IUser = {
  // _id: '64f4aae0e936f103e04dfb3e',
  name: 'joe',
  age: 21,
  plan: 'premium',

  address: {
    street: '123 main st',
    city: 'san francisco',
  },
  pets: ['dog', 'cat'],
  friend: '64f4aae0e936f103e04dfb3e',
  isAdmin: true,
}

// const user = await User.insertOne(data)
// console.log(user)

const user = await User
  .find({ age: { $gt: 20 } })
  .select(['-plan', 'isAdmin'])
  .exec()

console.log(user)

const users = await db.collection('user').find({}, {
  projection: {
    age: 1,
  },
}).toArray()

console.log(users)

// const user = userSchema.props.parse(data)
// console.log(user)
