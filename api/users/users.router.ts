import { Router } from 'express'
import { UserController } from './users.controller'
import { VerifyToken } from '../../auth_middleware/token_verification'
import { Request, Response } from 'express'

export const usersRoute = Router()
const userController = new UserController()
usersRoute.post('/register', userController.registerUser)
usersRoute.post('/login', userController.loginUser)
usersRoute.put(
  '/username',
  VerifyToken.verifyToken,
  userController.changeUserName
)
usersRoute.put('/email', VerifyToken.verifyToken, userController.chnageEmail)
