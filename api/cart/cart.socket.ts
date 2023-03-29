import { io, socketIds } from '../..'
import { CartServices } from './cart.services'

export class CartSockets{

    public notifyCartUpdate = async (userId: number) => {
        let sockets = socketIds.get(userId!.toString())
        if(sockets){
            sockets?.forEach((id) => {
                const socket = io.sockets.sockets.get(id.toString())
                socket?.emit('cart_updated')
            })
        }
    }

    public notifyCartDelete = async (cartItem: any) => {
        console.log('notify delete triggered')
        console.log(cartItem.user.id)
        let sockets = socketIds.get(cartItem.user.id!.toString())
        if(sockets){
            sockets?.forEach((id) => {
                console.log('sending to socket' , id)
                const socket = io.sockets.sockets.get(id.toString())
                socket?.emit('cart_delete', cartItem)
            })
        }
    }
}