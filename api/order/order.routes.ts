import { Router } from 'express'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'
import { OrderController } from './order.controller'

const orderController = new OrderController()

export const orderRouter = Router()

orderRouter.post('/', AuthorizationController.verifyToken, orderController.makeOrderFromCart)
orderRouter.get('/:orderId', AuthorizationController.verifyToken, orderController.getOrderById)
orderRouter.post('/makepayment/', AuthorizationController.verifyToken, orderController.makePaymentIntent)
orderRouter.post('/placeorder', AuthorizationController.verifyToken,orderController.placeOrder)

