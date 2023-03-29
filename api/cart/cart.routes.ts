import { Router } from 'express'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'
import { CartController } from './cart.controller'

export const cartRouter = Router()
let cartController = new CartController()

cartRouter.get('/:cartId', AuthorizationController.verifyToken, cartController.getCartItem)
cartRouter.get('/user/:userId', AuthorizationController.verifyToken, cartController.getUsersItems)
cartRouter.post('/', AuthorizationController.verifyToken, cartController.addItemToCart)
cartRouter.delete('/:cartId', AuthorizationController.verifyToken, cartController.removeCartItem)
cartRouter.patch('/quantity', AuthorizationController.verifyToken, cartController.updateQuantityInCart)