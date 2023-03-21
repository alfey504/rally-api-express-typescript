import { Router } from 'express'
import { AddressController } from './address.controller'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'

export const addressRouter = Router()

let addressController = new AddressController

addressRouter.post('/', AuthorizationController.verifyToken, addressController.addNewAddress)
addressRouter.get('/user/:userId', AuthorizationController.verifyToken, addressController.getAddressByUserId)
addressRouter.delete('/:addressId', AuthorizationController.verifyToken, addressController.removeAddress)

