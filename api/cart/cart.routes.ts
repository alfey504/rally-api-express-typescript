import { Router } from 'express'
import { CartController } from './cart.controller'

export const menuRouter = Router()
let cartController = new CartController()

menuRouter.get('/:cartId', cartController.getCartItem)
menuRouter.get('/user/:userId', cartController.getUsersItems)
menuRouter.post('/', cartController.addItemToCart)
menuRouter.delete('/:cartId', cartController.removeCartItem)
