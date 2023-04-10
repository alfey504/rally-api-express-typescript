import { io, socketIds } from '../..'
import { Orders } from '../../database/entity/order'
import { OrderServices } from './order.service'

export class OrderSockets{

    orderServices: OrderServices

    constructor() {
        this.orderServices = new OrderServices
    }

    public notifyStatusChange = async (orderId: number) => {
        try{
            let order = await this.orderServices.findOrderById(
                orderId, 
                (err?: any, orders?: Orders | null | undefined) => 
            {
                let userId = orders?.user.id
                let sockets = socketIds.get(userId!.toString())
                if(sockets){
                    sockets?.forEach((id) => {
                        const socket = io.sockets.sockets.get(id.toString())
                        socket?.emit('order_status_change', orders)
                    })
                }
            })
        }catch(error){
            console.log(error)
        }
    }

    public notifyCartEmptied = async (orderId: number) => {
        try{
            let order = await this.orderServices.findOrderById(
                orderId, 
                (err?: any, orders?: Orders | null | undefined) => 
            {
                let userId = orders?.user.id
                let sockets = socketIds.get(userId!.toString())
                if(sockets){
                    sockets?.forEach((id) => {
                        const socket = io.sockets.sockets.get(id.toString())
                        socket?.emit('cart_emptied', orders)
                    })
                }
            })
        }catch(error){
            console.log(error)
        }
    }
}