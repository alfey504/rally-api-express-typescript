import { Router } from 'express'
import { UserController } from './users.controller'
import { VerifyToken } from '../../auth_middleware/token_verification'

export const usersRoute = Router()
export function logUserEndPoints() {
    console.log('/register                  METHOD:POST')
    console.log('/login                     METHOD:POST')
    console.log('/username                  METHOD:PUT')
    console.log('/email                     METHOD:PUT')
}

const userController = new UserController()

// register new user
usersRoute.post('/register', userController.registerUser)

// login a user
usersRoute.post('/login', userController.loginUser)

// chnage username for userid
usersRoute.put(
    '/username',
    VerifyToken.verifyToken,
    userController.changeUserName
)

//  change password for userid
usersRoute.put('/email', VerifyToken.verifyToken, userController.changeEmail)
