import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Toodoo } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Toodoo.create({ ...body, user })
    .then((toodoo) => toodoo.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ user, querymen: { query, select, cursor } }, res, next) =>
  Toodoo.find({user: user.id}, select, cursor)
    .populate('user')
    .then((toodoos) => toodoos.map((toodoo) => toodoo.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Toodoo.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((toodoo) => toodoo ? toodoo.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Toodoo.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((toodoo) => toodoo ? Object.assign(toodoo, body).save() : null)
    .then((toodoo) => toodoo ? toodoo.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Toodoo.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((toodoo) => toodoo ? toodoo.remove() : null)
    .then(success(res, 204))
    .catch(next)
