import { Router } from "express"
import { UserController } from "./users.controller"

export const usersRoute = Router()
const userController = new UserController()
usersRoute.post('/register', userController.registerUser)
usersRoute.post('/login', userController.loginUser)
