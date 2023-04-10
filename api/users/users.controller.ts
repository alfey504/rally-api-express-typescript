import { User } from '../../database/entity/users'
import { Request, Response } from 'express'
import { UserServices } from './users.services'
import { hashSync, genSaltSync, compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { Verify } from './users.verification'
import { Token } from '../../database/entity/tokens'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'

dotenv.config()

export class UserController {
    userServices: UserServices
    verify: Verify

    constructor() {
        this.userServices = new UserServices()
        this.verify = new Verify()
    }

    // function to handle the /register endpoint
    // verify the data in the request and use service to add data to the database
    public registerUser = async (req: Request, res: Response) => {
        // verifying the data
        if (req.body.fullName == undefined || this.verify.isStringEmpty(req.body.fullName)) {
            res.status(400).json({
                success: 0,
                message: 'missing parameter {fullName:}',
                data: []
            })
            return
        }

        if (req.body.email == undefined || this.verify.isStringEmpty(req.body.email)) {
            res.status(400).json({
                success: 0,
                message: 'missing parameter {email:}',
                data: []
            })
            return
        }

        if (await this.verify.doesEmailExist(req.body.email)) {
            res.status(409).json({
                success: Verify.USER_EMAIL_ALREADY_EXISTS,
                message: 'Email already exists',
                data: []
            })
            return
        }

        if (req.body.userName == undefined || this.verify.isStringEmpty(req.body.userName)) {
            res.status(400).json({
                success: 0,
                message: 'missing parameter {userName:}',
                data: []
            })
            return
        }

        if (await this.verify.doesUserNameExist(req.body.userName)) {
            res.status(409).json({
                success: Verify.USER_USERNAME_ALREADY_EXISTS,
                message: 'Username already exists',
                data: []
            })
            return
        }

        if (req.body.password == undefined ||  this.verify.isStringEmpty(req.body.password)) {
            res.status(400).json({
                success: 0,
                message: 'missing parameter {password:}',
                data: []
            })
            return
        }

        // using the service to add the data to the database
        try {
            const user = new User()
            user.fullName = req.body.fullName!
            user.email = req.body.email!
            user.userName = req.body.userName!
            user.verified = false

            // encrypt the password
            const salt = genSaltSync(10)
            user.password = hashSync(req.body.password!.toString(), salt)

            this.userServices.addUser(user, (error: any, result: any) => {
                if (error) {
                    let response = {
                        success: 0,
                        message:
                            'DATABASE ERROR: failed to add user to data base',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                }

                console.log(result.toString())
                if (!result) {
                    let response = {
                        success: 0,
                        message:
                            'DATABASE ERROR: failed to add user to data base',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                }

                result.then((value: any) => {
                    delete value['password']

                    let response = {
                        success: Verify.USER_USER_ADDED_SUCCESSFULLY,
                        message: 'Successfully added user to database',
                        data: [value]
                    }
                    res.json(response)
                })
            })
        } catch (error) {
            console.log(error)

            let response = {
                success: 0,
                message: 'DATABASE ERROR: failed to add user to data base',
                data: []
            }

            res.status(500).json(response)
        }
    }

    // function to handle the /login endpoint
    // verify the data in the request and use service to verify the password and generate and start a session
    public loginUser = async (req: Request, res: Response) => {
        const userName = req.body.userName
        const password = req.body.password

        if (req.body.userName == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userName:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if (req.body.password == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {password:}',
                data: []
            }
            res.status(400).json()
            return
        }

        this.userServices.getUserByUserName(
            userName,
            (error: any, result: any) => {
                if (error) {
                    let response = {
                        success: 0,
                        message: 'Login failed database error',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                }

                if (!result) {
                    let response = {
                        success: Verify.USER_USERNAME_DOES_NOT_EXIST,
                        message: 'Login failed user does not exist',
                        data: []
                    }
                    res.json(response)
                    return
                }

                if (!compareSync(password, result.password)) {
                    let response = {
                        success: Verify.USER_INCORRECT_PASSWORD,
                        message: 'Login failed incorrect password',
                        data: []
                    }
                    res.json(response)
                    return
                }

                let jsonToken = sign(
                    {
                        user: {
                            id: result.id,
                            userName: result.userName
                        }
                    },
                    process.env.TOKEN_ENCRYPTION_KEY!
                )

                let token = new Token()
                token.user = result.id
                token.token = jsonToken
                token.blackListed = false

                this.userServices.saveToken(
                    token,
                    (error: any, resultToken: any) => {
                        if (error) {
                            let response = {
                                success: 0,
                                message:
                                    'Could not generate token : Database error',
                                data: []
                            }
                            res.status(500).json(response)
                            return
                        }

                        let response = {
                            success: 1,
                            message: 'Login successful',
                            data: [
                                {
                                    userId: result.id,
                                    userName: result.userName,
                                    email: result.email,
                                    token: jsonToken
                                }
                            ]
                        }
                        res.json(response)
                    }
                )
            }
        )
    }

    // function to handle the /username :PUT endpoint
    // verify the data in the request and use service to verify the password and generate a token and start a session
    public changeUserName = async (req: Request, res: Response) => {
        let userName = req.body.userName
        let userId = req.body.userId

        if (req.body.userName == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userName:}',
                data: []
            }
            res.status(400).json(response)
            return
        } 

        if (await this.verify.doesUserNameExist(req.body.userName)) {
            let response = {
                success: Verify.USER_USERNAME_ALREADY_EXISTS,
                message: 'Username already exists',
                data: []
            }
            res.status(409).json(response)
            return
        }

        if (req.body.userId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {id:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        let token = req.get('authorization')!!
        token = token.slice(7)
        let result = AuthorizationController.tokenBelongsToUser(token, +req.body.userId, (err?: any, result?: Boolean) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to Verify if token belongs to user: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            if(!result){

                let response = {
                    success: 0,
                    message: 'Token does not belong to user',
                    data: []
                }
                res.status(401).json(response)
                return
            }
        })

        if(result == undefined) return

        this.userServices.updateUserName(
            userName,
            userId,
            (error: any, result: any) => {
                if (error) {
                    console.log(error)
                    let response = {
                        success: 0,
                        message: 'DATABASE ERROR: failed to update username',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                }
                
                if (result.affected == 0 || !result) {
                    console.log(result.affected)
                    let response = {
                        success: Verify.USER_ID_DOES_NOT_EXIST,
                        message:
                            'Could not find the user with ' +
                            userId +
                            ' or username already exist',
                        data: []
                    }
                    res.status(409).json(response)
                    return
                } 
                
                let response = {
                    success: 1,
                    message: 'Updated username successfully',
                    data: []
                }
                res.json(response)
                return
            }
        )
    }

    // function to handle the /email :PUT endpoint
    // lets you change the email of the user with user id
    public changeEmail = async (req: Request, res: Response) => {
        let email = req.body.email
        let userId = req.body.userId

        if (req.body.email == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userName:}',
                data: []
            }
            res.status(400).json(response)
            return

        } 
        
        if (await this.verify.doesEmailExist(req.body.email)) {
            let response = {
                success: Verify.USER_USERNAME_ALREADY_EXISTS,
                message: 'Username already exists',
                data: []
            }
            res.status(409).json(response)
            return
        }

        if (req.body.userId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {id:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        let token = req.get('authorization')!!
        token = token.slice(7)
        let result = AuthorizationController.tokenBelongsToUser(token, +req.body.userId, (err?: any, result?: Boolean) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to Verify if token belongs to user: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            if(!result){

                let response = {
                    success: 0,
                    message: 'Token does not belong to user',
                    data: []
                }
                res.status(401).json(response)
                return
            }
        })

        if(result == undefined) return

        this.userServices.updateEmail(
            email,
            userId,
            (error: any, result: any) => {
                if (error) {
                    console.log(error)
                    let response = {
                        success: 0,
                        message: 'DATABASE ERROR: failed to update email',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                } 
                    
                if (result.affected == 0) {
                    console.log(result.affected)
                    let response = {
                        success: Verify.USER_ID_DOES_NOT_EXIST,
                        message:
                            'Could not find the user with id ' +
                            userId +
                            ' or email already exist',
                        data: []
                    }
                    res.status(409).json(response)
                    return
                } 
                        
                let response = {
                    success: 1,
                    message: 'Updated email successfully',
                    data: []
                }
                res.json(response)
                return

            }
        )
    }

    // function to handle the /password :PUT endpoint
    // lets you change the password of the user with user id
    public changePassword = async (req: Request, res: Response) => {
        let password = req.body.password
        let userId = req.body.userId

        if (req.body.password == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {password:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        const salt = genSaltSync(10)
        password = hashSync(password!.toString(), salt)

        if (req.body.userId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {id:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        let token = req.get('authorization')!!
        token = token.slice(7)
        let result = AuthorizationController.tokenBelongsToUser(token, +req.body.userId, (err?: any, result?: Boolean) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to Verify if token belongs to user: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            if(!result){

                let response = {
                    success: 0,
                    message: 'Token does not belong to user',
                    data: []
                }
                res.status(401).json(response)
                return
            }
        })

        if(result == undefined) return

        this.userServices.updatePassword(
            password,
            userId,
            (error: any, result: any) => {
                if (error) {
                    console.log(error)
                    let response = {
                        success: 0,
                        message: 'DATABASE ERROR: failed to update password',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                } 
                
                if (result.affected == 0) {
                    console.log(result.affected)
                    let response = {
                        success: Verify.USER_ID_DOES_NOT_EXIST,
                        message:
                            'Could not find the user with id ' +
                            userId +
                            ' or password already exist',
                        data: []
                    }
                    res.status(409).json(response)
                    return
                }
                        
                let response = {
                    success: 1,
                    message: 'Updated password successfully',
                    data: []
                }
                res.json(response)
                return
            }
        )
    }

    // function to handle the /logout :DELETE endpoint
    // lets you expire or blacklist a token
    public logoutUser = async (req: Request, res: Response) => {
        let token = req.get('authorization')
        if (token) {
            token = token.slice(7)
            console.log(token)
            this.userServices.blackListToken(token, (err: any, result: any) => {
                if (!err) {
                    let response = {
                        success: 1,
                        message: 'Logged out successfully',
                        data: []
                    }
                    res.json(response)
                } else {
                    let response = {
                        success: 0,
                        message: 'Logout failed: Database error',
                        data: []
                    }
                    res.status(500).json(response)
                }
            })
        } else {
            let response = {
                success: 0,
                message: 'token not found in request',
                data: []
            }
            res.status(400).json(response)
        }
    }

    public getUserById = async (req: Request, res: Response) => {

        if (req.params.userId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {id:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        this.userServices.findUserBy(+req.params.userId, (err?: any, result?: User | null) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to Fetch user: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'fetched successfully',
                data: [result]
            }
            res.json(response)
            return
        })
    }

    public updateUser = async (req: Request, res: Response) => {
        let password = req.body.password
        let userId = req.body.userId

        if (req.body.fullName == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {fullName:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if (req.body.email == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {email:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if (req.body.userName == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userName:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if (req.body.password != undefined) {
            const salt = genSaltSync(10)
            password = hashSync(password!.toString(), salt)
        }else{
            password = null
        }

        if (req.body.userId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {id:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        let token = req.get('authorization')!!
        token = token.slice(7)
        let result = AuthorizationController.tokenBelongsToUser(token, +req.body.userId, (err?: any, result?: Boolean) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to Verify if token belongs to user: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            if(!result){

                let response = {
                    success: 0,
                    message: 'Token does not belong to user',
                    data: []
                }
                res.status(401).json(response)
                return
            }
        })

        if(result == undefined) return

        this.userServices.updateUser(
            userId = +req.body.userId,
            req.body.userName,
            req.body.fullName,
            req.body.fullName,
            password,
            (err?: any, result?: any) => {
                if (err) {
                    console.log(err)
                    let response = {
                        success: 0,
                        message: 'DATABASE ERROR: failed to update user',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                } 
                
                if (result.affected == 0) {
                    console.log(result.affected)
                    let response = {
                        success: Verify.USER_ID_DOES_NOT_EXIST,
                        message:
                            'Could not find the user with id ' +
                            userId +
                            ' or data already exist',
                        data: []
                    }
                    res.status(409).json(response)
                    return
                }
                        
                let response = {
                    success: 1,
                    message: 'Updated user successfully',
                    data: []
                }
                res.json(response)
                return
            }
        )
    }

}
