import { Router } from 'express'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'
import { CartController } from './cart.controller'

export const menuRouter = Router()
let cartController = new CartController()

menuRouter.get('/:cartId', AuthorizationController.verifyToken, cartController.getCartItem)
menuRouter.get('/user/:userId', AuthorizationController.verifyToken, cartController.getUsersItems)
menuRouter.post('/', AuthorizationController.verifyToken, cartController.addItemToCart)
menuRouter.delete('/:cartId', AuthorizationController.verifyToken, cartController.removeCartItem)
