import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Todo } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Todo.create({ ...body, user })
    .then((todo) => todo.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Todo.find(query, select, cursor)
    .populate('user')
    .then((todos) => todos.map((todo) => todo.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Todo.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((todo) => todo ? todo.view() : null)
    .then(success(res))
    .catch(next)
/* Express.JS middleware - autorização
export const show = ({ params }, res, next) =>
  Todo.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((todo) => todo ? todo.view() : null)
    .then(success(res))
    .catch(next)
*/
export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Todo.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((todo) => todo ? Object.assign(todo, body).save() : null)
    .then((todo) => {
      return todo.handleStatusChange()
    })
    .then((todo) => todo ? todo.view(true) : null)
    .then(success(res))
    .catch(next)
// old example update
// .then((typeof Boolean(body.status) && body.status) ? body.completed_at = new Date() : delete body.completed_at)

export const destroy = ({ user, params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((todo) => todo ? todo.remove() : null)
    .then(success(res, 204))
    .catch(next)
