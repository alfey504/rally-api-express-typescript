import { UserServices } from '../users/users.services'
import { Verify } from '../users/users.verification'
import { Request, Response } from 'express'
import { User } from '../../database/entity/users'
import { genSaltSync, hashSync } from 'bcrypt'

export class AdminController{
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
}