import { Router } from 'express'
import { MenuController } from './menu.controller'

export const menuRouter = Router()
let menuController = new MenuController()

menuRouter.get('/', menuController.getAllMenuItems)
menuRouter.get('/category/:categoryId', menuController.getMenuByCategory)
menuRouter.get('/:menuId', menuController.getMenuById)
menuRouter.post('/', menuController.addMenuItem)
menuRouter.delete('/:id', menuController.removeMenuItem)
menuRouter.get('/search/:search', menuController.searchMenuItems)