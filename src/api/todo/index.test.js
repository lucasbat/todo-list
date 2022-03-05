import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Todo } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, todo

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  todo = await Todo.create({ user })
})

test('POST /todos 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', status: 'test', completed_at: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.completed_at).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /todos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /todos 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /todos 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /todos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${todo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(todo.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /todos/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${todo.id}`)
  expect(status).toBe(401)
})

test('GET /todos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /todos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${todo.id}`)
    .send({ access_token: userSession, title: 'test', status: 'test', completed_at: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(todo.id)
  expect(body.title).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.completed_at).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /todos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${todo.id}`)
    .send({ access_token: anotherSession, title: 'test', status: 'test', completed_at: 'test' })
  expect(status).toBe(401)
})

test('PUT /todos/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${todo.id}`)
  expect(status).toBe(401)
})

test('PUT /todos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', status: 'test', completed_at: 'test' })
  expect(status).toBe(404)
})

test('DELETE /todos/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${todo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /todos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${todo.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /todos/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${todo.id}`)
  expect(status).toBe(401)
})

test('DELETE /todos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
