import { verify } from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as dotenv from 'dotenv'

dotenv.config()

export class VerifyToken {
  public static verifyToken = (req: Request, res: Response, next: any) => {
    let token = req.get('authorization')
    if (token) {
      token = token.slice(7)
      verify(
        token,
        process.env.TOKEN_ENCRYPTION_KEY!,
        (err: any, decoded: any) => {
          if (err) {
            let response = {
              sucess: 0,
              message: 'Invaild Token',
              data: [{}]
            }
            res.json(response)
          } else {
            next()
          }
        }
      )
    } else {
      let response = {
        sucess: 0,
        message: 'Access denied! make sure you have a token',
        data: [{}]
      }
      res.json(response)
    }
  }
}
