import { verify } from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { getDataSource } from '../database/data_source'
import { Token } from '../database/entity/tokens'
import { Equal } from 'typeorm'
import { UserController } from '../api/users/users.controller'
import { UserServices } from '../api/users/users.services'
import { AuthorizationServices } from './authorization.services'

dotenv.config()

export class AuthorizationController {
    public static verifyToken = async (
        req: Request,
        res: Response,
        next: any
    ) => {
        let token = req.get('authorization')
        if (token) {
            token = token.slice(7)
            verify(
                token,
                process.env.TOKEN_ENCRYPTION_KEY!,
                async (err: any, decoded: any) => {
                    if (err) {
                        console.log('invalid token')
                        let response = {
                            success: 0,
                            message: 'Invalid Token',
                            data: [{}]
                        }
                        res.status(401).json(response)
                    } else {
                        if (await AuthorizationServices.isTokenBlacklisted(token!)) {
                            next()
                        } else {
                            let response = {
                                success: 0,
                                message: 'Invalid Token',
                                data: [{}]
                            }
                            res.status(401).json(response)
                        }
                    }
                }
            )
        } else {
            console.log('token does not exist')
            let response = {
                success: 0,
                message: 'Access denied! make sure you have a token',
                data: [{}]
            }
            res.status(401).json(response)
        }
    }

    public static isAdmin =async ( req: Request,
        res: Response,
        next: any
    ) => {
        let token = req.get('authorization')
        if (token == undefined) {
            console.log('token does not exist')
            let response = {
                success: 0,
                message: 'Access denied! make sure you have a token',
                data: [{}]
            }
            res.status(401).json(response)
            return
        }

        token = token.slice(7)
        verify(
            token,
            process.env.TOKEN_ENCRYPTION_KEY!,
            async (err: any, decoded: any) => {
                if (err) {
                    console.log('invalid token')
                    let response = {
                        success: 0,
                        message: 'Invalid Token',
                        data: []
                    }
                    res.status(401).json(response)
                    return
                } 
                console.log(await AuthorizationServices.isTokenNotBlackListedAndAdmin(token!))
                if (!await AuthorizationServices.isTokenNotBlackListedAndAdmin(token!)) {
                    next()
                    return
                } 
                let response = {
                    success: 0,
                    message: 'Invalid Token',
                    data: []
                }
                res.status(401).json(response)
            }        
        )
    }

    public static tokenBelongsToUser = async ( 
        token: String,
        userId: number,
        callback: (error?: any, result?: Boolean) => void
    ): Promise<Boolean | undefined>  => {

        let result = await AuthorizationServices.doesTokenBelongToUser(token, userId, (error?: any, result?: Boolean) => {
            if(error){
                callback(error)
                console.log('AuthorizationServices-> TokenBelongsToUser -> Error: ' + error.toString())
            }else{
                callback(null, result)
            }
        })
        return result
    }

}
