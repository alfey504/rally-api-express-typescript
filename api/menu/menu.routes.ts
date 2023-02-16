import { Router } from 'express'
import { MenuController } from './menu.controller'

export const menuRouter = Router()
let menuController = new MenuController()

menuRouter.get('/', menuController.getAllMenuItems)
menuRouter.get('/:categoryId', menuController.getMenuByCategory)
menuRouter.post('/', menuController.addMenuItem)
menuRouter.delete('/:id', menuController.removeMenuItem)
