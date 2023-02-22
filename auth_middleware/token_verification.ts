import { verify } from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { getDataSource } from '../database/data_source'
import { Token } from '../database/entity/tokens'
import { Equal } from 'typeorm'

dotenv.config()

export class VerifyToken {
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
                        let response = {
                            sucess: 0,
                            message: 'Invaild Token',
                            data: [{}]
                        }
                        res.status(401).json(response)
                    } else {
                        if (await this.isTokenBlacklisted(token!)) {
                            next()
                        } else {
                            let response = {
                                sucess: 0,
                                message: 'Invaild Token',
                                data: [{}]
                            }
                            res.status(401).json(response)
                        }
                    }
                }
            )
        } else {
            let response = {
                sucess: 0,
                message: 'Access denied! make sure you have a token',
                data: [{}]
            }
            res.status(401).json(response)
        }
    }

    private static isTokenBlacklisted = async (
        token: string
    ): Promise<Boolean> => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Token)
            const result = await rallyRepo.findOne({
                where: {
                    token: Equal(token)
                }
            })
            return !result?.blackListed!
        } catch (error) {
            return false
        }
    }
}
