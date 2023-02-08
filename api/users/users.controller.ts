import { User } from "../../database/entity/User"
import { Request, Response } from "express"
import { getDataSource } from "../../database/data_source"
import { UserServices } from "./users.services"
import { AnyMxRecord } from "dns"
import { Verified, UserData } from "user_types"
import { hashSync, genSaltSync, compareSync } from "bcrypt"


export class UserController {

    userServices: UserServices

    constructor(){
        this.userServices = new UserServices()
    }

    public registerUser = (async (req: Request, res: Response) => {
        const userData: UserData = {
            fullName: req.body.fullName,
            email: req.body.email,
            userName : req.body.userName,
            password : req.body.password,
            verified : false,
        } 
        const verified = this.userServices.verifyUser(userData)

        if(!verified.verified){

            res.json({
                success: 0,
                message: verified.message
            })

        }else{

            try{
                const user = new User()
                user.fullName = userData.fullName!
                user.email = userData.email!
                user.userName = userData.userName!

                const salt = genSaltSync(10);
                user.password = hashSync(userData.password!.toString(), salt)
                user.verified = userData.verified!
                
                this.userServices.addUser(user, (error: any, result: any) => {
                    if(error){
                        res.json({
                            success: 0,
                            message: 'DATABASE ERROR: failed to add user to data base'
                        })
                    }else{
                        if(!result){
                            res.json({
                                success: 0,
                                message: 'DATABASE ERROR: failed to add user to data base'
                            })
                        }else{
                            res.json({
                                success: 1,
                                message: 'Successfully added data to database'
                            })
                        }
                       
                    }
                })
                
            }catch(error){
                console.log(error)
                res.json({
                    success: 0,
                    message: 'DATABASE ERROR: failed to add user to data base'
                })
            }

        }

    })
    
    public loginUser = (async (req: Request, res: Response) => {
        const userName = req.body.userName
        const password = req.body.password

        this.userServices.getUserByUserName(userName, (error: any, result: any) => {

            if(error){
                res.json({
                    success: 0,
                    message: 'Login failed database error'
                })
            }else{
                if(!result){
                    res.json({
                        success: 0,
                        message: 'Login failed user does not exist'
                    })
                }else{
                    if(compareSync(password, result.password)){
                        res.json({
                            success: 1,
                            message: 'Login sucessful'
                        })
                    }else{
                        res.json({
                            success: 0,
                            message: 'Incorrect password'
                        })
                    }
                    
                }
            }
        })
    })

}

