import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Toodoo, { schema } from './model'

const router = new Router()
const { title, note, status, completed_at, priority } = schema.tree

/**
 * @api {post} /toodoos Create toodoo
 * @apiName CreateToodoo
 * @apiGroup Toodoo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Toodoo's title.
 * @apiParam note Toodoo's note.
 * @apiParam status Toodoo's status.
 * @apiParam completed_at Toodoo's completed_at.
 * @apiParam priority Toodoo's priority.
 * @apiSuccess {Object} toodoo Toodoo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Toodoo not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, note, status, completed_at, priority }),
  create)

/**
 * @api {get} /toodoos Retrieve toodoos
 * @apiName RetrieveToodoos
 * @apiGroup Toodoo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} toodoos List of toodoos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /toodoos/:id Retrieve toodoo
 * @apiName RetrieveToodoo
 * @apiGroup Toodoo
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} toodoo Toodoo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Toodoo not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

/**
 * @api {put} /toodoos/:id Update toodoo
 * @apiName UpdateToodoo
 * @apiGroup Toodoo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Toodoo's title.
 * @apiParam note Toodoo's note.
 * @apiParam status Toodoo's status.
 * @apiParam completed_at Toodoo's completed_at.
 * @apiParam priority Toodoo's priority.
 * @apiSuccess {Object} toodoo Toodoo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Toodoo not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, note, status, completed_at, priority }),
  update)

/**
 * @api {delete} /toodoos/:id Delete toodoo
 * @apiName DeleteToodoo
 * @apiGroup Toodoo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Toodoo not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
