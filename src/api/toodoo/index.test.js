import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Toodoo } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, adminSession, toodoo

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  toodoo = await Toodoo.create({ user })
})

test('POST /toodoos 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', note: 'test', status: 'test', completed_at: 'test', priority: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.note).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.completed_at).toEqual('test')
  expect(body.priority).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /toodoos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /toodoos 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /toodoos 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /toodoos/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${toodoo.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(toodoo.id)
})

test('GET /toodoos/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${toodoo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /toodoos/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${toodoo.id}`)
  expect(status).toBe(401)
})

test('GET /toodoos/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /toodoos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${toodoo.id}`)
    .send({ access_token: userSession, title: 'test', note: 'test', status: 'test', completed_at: 'test', priority: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(toodoo.id)
  expect(body.title).toEqual('test')
  expect(body.note).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.completed_at).toEqual('test')
  expect(body.priority).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /toodoos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${toodoo.id}`)
    .send({ access_token: anotherSession, title: 'test', note: 'test', status: 'test', completed_at: 'test', priority: 'test' })
  expect(status).toBe(401)
})

test('PUT /toodoos/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${toodoo.id}`)
  expect(status).toBe(401)
})

test('PUT /toodoos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', note: 'test', status: 'test', completed_at: 'test', priority: 'test' })
  expect(status).toBe(404)
})

test('DELETE /toodoos/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${toodoo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /toodoos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${toodoo.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /toodoos/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${toodoo.id}`)
  expect(status).toBe(401)
})

test('DELETE /toodoos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
