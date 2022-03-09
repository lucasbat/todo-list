import { Toodoo } from '.'
import { User } from '../user'

let user, toodoo

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  toodoo = await Toodoo.create({ user, title: 'test', note: 'test', status: 'test', completed_at: 'test', priority: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = toodoo.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(toodoo.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(toodoo.title)
    expect(view.note).toBe(toodoo.note)
    expect(view.status).toBe(toodoo.status)
    expect(view.completed_at).toBe(toodoo.completed_at)
    expect(view.priority).toBe(toodoo.priority)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = toodoo.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(toodoo.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(toodoo.title)
    expect(view.note).toBe(toodoo.note)
    expect(view.status).toBe(toodoo.status)
    expect(view.completed_at).toBe(toodoo.completed_at)
    expect(view.priority).toBe(toodoo.priority)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
