import { User } from '../../database/entity/User'
import { Request, Response } from 'express'
import { UserServices } from './users.services'
import { UserData } from 'user_types'
import { hashSync, genSaltSync, compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { Verify } from './users.verification'

dotenv.config()

export class UserController {
    userServices: UserServices
    verify: Verify

    constructor() {
        this.userServices = new UserServices()
        this.verify = new Verify()
    }

    // function to handle the /register endpoint
    // verify the data in the requeat and use service to add data to the database
    public registerUser = async (req: Request, res: Response) => {
        // verifying the data
        if (req.body.fullName == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'missing parameter {fullName:}',
                data: [{}]
            })
        }

        if (req.body.email == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'missing parameter {email:}',
                data: [{}]
            })
        } else {
            if (await this.verify.doesEmaiExist(req.body.email)) {
                res.sendStatus(200).json({
                    success: Verify.USER_EMAIL_ALREADY_EXISTS,
                    message: 'Email already exists',
                    data: [{}]
                })
            }
        }

        if (req.body.userName == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'missing parameter {userName:}',
                data: [{}]
            })
        } else {
            if (await this.verify.doesUserNameExist(req.body.userName)) {
                res.sendStatus(200).json({
                    success: Verify.USER_USERNAME_ALREADY_EXISTS,
                    message: 'Username already exists',
                    data: [{}]
                })
            }
        }

        if (req.body.password == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'missing parameter {password:}',
                data: [{}]
            })
        }

        // using the service to add the data to the database
        try {
            const user = new User()
            user.fullName = req.body.fullName!
            user.email = req.body.email!
            user.userName = req.body.userName!

            // encrypt the password
            const salt = genSaltSync(10)
            user.password = hashSync(req.body.password!.toString(), salt)
            user.verified = req.body.verified!

            this.userServices.addUser(user, (error: any, result: any) => {
                if (error) {
                    res.json({
                        success: 0,
                        message:
                            'DATABASE ERROR: failed to add user to data base',
                        data: [{}]
                    })
                } else {
                    console.log(result.toString())
                    if (!result) {
                        res.json({
                            success: 0,
                            message:
                                'DATABASE ERROR: failed to add user to data base',
                            data: [{}]
                        })
                    } else {
                        res.json({
                            success: Verify.USER_USER_ADDED_SUCCESSFULLY,
                            message: 'Successfully added data to database',
                            data: [{}]
                        })
                    }
                }
            })
        } catch (error) {
            console.log(error)
            res.json({
                success: 0,
                message: 'DATABASE ERROR: failed to add user to data base'
            })
        }
    }

    // function to handle the /login endpoint
    // verify the data in the requeat and use service to verify the password and genrate and start a session
    public loginUser = async (req: Request, res: Response) => {
        const userName = req.body.userName
        const password = req.body.password

        if (req.body.userName == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'miisging parameter {userName:}',
                data: [{}]
            })
        }

        if (req.body.password == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'missing parameter {password:}',
                data: [{}]
            })
        }

        this.userServices.getUserByUserName(
            userName,
            (error: any, result: any) => {
                if (error) {
                    res.json({
                        success: 0,
                        message: 'Login failed database error'
                    })
                } else {
                    if (!result) {
                        res.json({
                            success: 0,
                            message: 'Login failed user does not exist'
                        })
                    } else {
                        if (compareSync(password, result.password)) {
                            let jsonToken = sign(
                                { result: result },
                                process.env.TOKEN_ENCRYPTION_KEY!
                            )
                            res.json({
                                success: 1,
                                message: 'Login sucessful',
                                data: [
                                    {
                                        userId: result.id,
                                        userName: result.userName,
                                        email: result.email,
                                        token: jsonToken
                                    }
                                ]
                            })
                        } else {
                            res.json({
                                success: 0,
                                message: 'Incorrect password'
                            })
                        }
                    }
                }
            }
        )
    }

    // function to handle the /username :PUT endpoint
    // verify the data in the requeat and use service to verify the password and genrate a token and start a session
    public changeUserName = async (req: Request, res: Response) => {
        let userName = req.body.userName
        let userId = req.body.id

        if (req.body.userName == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'missing parameter {userName:}',
                data: [{}]
            })
        } else {
            if (await this.verify.doesUserNameExist(req.body.userName)) {
                res.sendStatus(200).json({
                    success: Verify.USER_USERNAME_ALREADY_EXISTS,
                    message: 'Username already exists',
                    data: [{}]
                })
            }
        }

        if (req.body.id == undefined) {
            res.sendStatus(401).json({
                success: 0,
                message: 'missing parameter {id:}',
                data: [{}]
            })
        }

        this.userServices.updateUserName(
            userName,
            userId,
            (error: any, result: any) => {
                if (error) {
                    console.log(error)
                    let response = {
                        success: 0,
                        message: 'DATABASE ERROR: failed to update username',
                        data: [{}]
                    }
                    res.json(response)
                } else {
                    if (result.affected == 0 || !result) {
                        console.log(result.affected)
                        let response = {
                            success: 0,
                            message:
                                'Could not find the user with ' +
                                userId +
                                ' or username already exist',
                            data: [{}]
                        }
                        res.json(response)
                    } else {
                        console.log(result.affected)
                        let response = {
                            success: 1,
                            message: 'Updated username successfully',
                            data: [{}]
                        }
                        res.json(response)
                    }
                }
            }
        )
    }

    // function to handle the /email :PUT endpoint
    // lets you change the email of the user with user id
    public changeEmail = async (req: Request, res: Response) => {
        let email = req.body.email
        let userId = req.body.id

        if (email != undefined && userId != undefined) {
            this.userServices.updateEmail(
                email,
                userId,
                (error: any, result: any) => {
                    if (error) {
                        console.log(error)
                        let response = {
                            success: 0,
                            message: 'DATABASE ERROR: failed to update email',
                            data: [{}]
                        }
                        res.json(response)
                    } else {
                        if (result.affected == 0) {
                            console.log(result.affected)
                            let response = {
                                success: 0,
                                message:
                                    'Could not find the user with id ' +
                                    userId +
                                    ' or email already exist',
                                data: [{}]
                            }
                            res.json(response)
                        } else {
                            console.log(result.affected)
                            let response = {
                                success: 1,
                                message: 'Updated email successfully',
                                data: [{}]
                            }
                            res.json(response)
                        }
                    }
                }
            )
        } else {
            let response = {
                success: 0,
                message: 'email or user id is missing',
                data: [{}]
            }
            res.json(response)
        }
    }
}
