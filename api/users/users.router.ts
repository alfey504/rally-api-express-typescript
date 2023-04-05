import { Router } from 'express'
import { UserController } from './users.controller'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'

export const usersRoute = Router()

export function logUserEndPoints() {
    console.log('/register                  METHOD:POST')
    console.log('/login                     METHOD:POST')
    console.log('/username                  METHOD:PUT')
    console.log('/email                     METHOD:PUT')
    console.log('/password                  METHOD:PUT')
}

const userController = new UserController()

// register new user
usersRoute.post('/register', userController.registerUser)

// login a user
usersRoute.post('/login', userController.loginUser)

// change username for userId
usersRoute.put(
    '/username',
    AuthorizationController.verifyToken,
    userController.changeUserName
)

//  change email for userId
usersRoute.put('/email', AuthorizationController.verifyToken, userController.changeEmail)

//  change password for userId
usersRoute.put(
    '/password',
    AuthorizationController.verifyToken,
    userController.changePassword
)

// logout the user
usersRoute.delete('/logout', AuthorizationController.verifyToken, userController.logoutUser)

// update user route
usersRoute.patch('/', AuthorizationController.verifyToken, userController.updateUser)

// get user by their id
usersRoute.get('/:userId', AuthorizationController.verifyToken, userController.getUserById)