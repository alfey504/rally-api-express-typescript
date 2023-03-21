import { Router, Request, Response } from 'express'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'
import { AdminController } from './admin.controller'

const adminController = new AdminController()

export const adminRouter = Router()

adminRouter.post('/', AuthorizationController.isAdmin, adminController.registerUser)

adminRouter.get('/check', AuthorizationController.isAdmin, (req: Request, res: Response) => {
    res.send('is an Admin')
})