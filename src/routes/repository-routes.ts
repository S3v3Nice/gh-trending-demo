import {Router} from 'express'
import * as repositoryController from '../controllers/repository-controller'

const router = Router()

router.get('/', repositoryController.getAll)
router.get('/:owner/:repository', repositoryController.getByName)
router.get('/:id(\\d+)', repositoryController.getById)
router.get('/sync', repositoryController.sync)

export default router
