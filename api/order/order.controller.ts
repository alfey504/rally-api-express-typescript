import { Request, Response } from 'express'
import { Orders } from '../../database/entity/order'
import { OrderServices } from './order.service'

export class  OrderController{

    orderServices: OrderServices

    constructor(){
        this.orderServices = new OrderServices()
    }

    public makeOrderFromCart = async (req : Request, res: Response) => {
        
        if(req.body.userId  == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        this.orderServices.makeOrderFromCart(+req.body.userId, (err?: any, order?: Orders) =>  {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to make order',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            let response = {
                success: 1,
                message: 'Successfully made order',
                data: order
            }
            res.json(response)
            return
        })        
    }
}