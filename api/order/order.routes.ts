import { Router } from 'express'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'
import { OrderController } from './order.controller'

const orderController = new OrderController()

export const orderRouter = Router()

orderRouter.post('/', AuthorizationController.verifyToken, orderController.makeOrderFromCart)
orderRouter.get('/:orderId', AuthorizationController.verifyToken, orderController.getOrderById)
orderRouter.get('/user/:userId', AuthorizationController.verifyToken, orderController.getOrderByUser)
orderRouter.post('/makepayment/', AuthorizationController.verifyToken, orderController.makePaymentIntent)
orderRouter.post('/placeorder', AuthorizationController.verifyToken, orderController.placeOrder)
orderRouter.delete('/:orderId', AuthorizationController.verifyToken, orderController.deleteOrderById)
orderRouter.post('/reorder', AuthorizationController.verifyToken, orderController.reorderOrderById)

// admin
orderRouter.get('/status/:status', AuthorizationController.verifyToken, orderController.getOrderByStatus)
orderRouter.patch('/status', AuthorizationController.verifyToken, orderController.updateOrderStatus)
