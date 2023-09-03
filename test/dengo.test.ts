import { dengo } from '../mod.ts'
import { assertEquals } from 'std/assert/mod.ts'

const DB_NAME = 'dengo'

Deno.test('dengo', { permissions: { net: true } }, async (t) => {
  await t.step({
    name: 'should connect and retrieve the name of the database',
    fn: async () => {
      const db = await dengo.connect(`mongodb://localhost:27017/${DB_NAME}`)
      assertEquals(db.name, DB_NAME)
      dengo.disconnect()
    },
  })
})
