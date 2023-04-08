import { Router } from 'express'
import { VoucherController } from './voucher.controller'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'


export const voucherRouter = Router()
let voucherController = new VoucherController()

voucherRouter.get('/:userId', AuthorizationController.verifyToken,voucherController.getUsersVoucher)
voucherRouter.post('/', AuthorizationController.isAdmin, voucherController.addNewVoucher)
voucherRouter.get('/code/:voucherCode', AuthorizationController.verifyToken,voucherController.getVoucherByCode)
voucherRouter.delete('/:userId', AuthorizationController.isAdmin, voucherController.deleteVoucher)

