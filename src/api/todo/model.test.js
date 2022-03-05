import { Todo } from '.'
import { User } from '../user'

let user, todo

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  todo = await Todo.create({ user, title: 'test', status: 'test', completed_at: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = todo.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(todo.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(todo.title)
    expect(view.status).toBe(todo.status)
    expect(view.completed_at).toBe(todo.completed_at)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = todo.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(todo.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(todo.title)
    expect(view.status).toBe(todo.status)
    expect(view.completed_at).toBe(todo.completed_at)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
