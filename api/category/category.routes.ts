import { Router } from 'express'
import { CategoryController } from './category.controller'

export const categoryRouter = Router()
let categoryController = new CategoryController()

categoryRouter.get('/', categoryController.getCategories)
categoryRouter.post('/', categoryController.addCategory)
categoryRouter.get('/:id', categoryController.getCategory)
categoryRouter.delete('/:id', categoryController.removeCategory)
