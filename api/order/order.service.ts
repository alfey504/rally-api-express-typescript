import BigNumber from 'bignumber.js'
import { DataSource, Equal } from 'typeorm'
import { getDataSource } from '../../database/data_source'
import { Cart } from '../../database/entity/carts'
import { Orders } from '../../database/entity/order'
import { OrderDetails } from '../../database/entity/order_details'
import { User } from '../../database/entity/users'

export enum OrderStatus{
    pending = 'pending',
    rejected = 'rejected',
    preparing = 'preparing',
    waitingForPickup = 'waiting_for_pickup',
    onTheWay = 'on_the_way',
    completed = 'completed'
}

export class OrderServices{

    public makeOrderFromCart = async (
        userId: any,
        callback: (err?: any, order?: Orders) => void
    ) =>  {

        try{
            let orderDetailsList = Array<OrderDetails>()
            const order = new Orders()
            order.user = userId

            let carts = await this.getCartItems(userId)
            let priceBeforeTax = BigNumber(0)

            let rallyDataSource = await getDataSource()
            let orderDetailRepo = rallyDataSource.getRepository(OrderDetails)

            carts.forEach(async (cart) => {
                let orderDetail = new OrderDetails()
                orderDetail.menu = cart.menu
                orderDetail.quantity = cart.quantity
                orderDetail.price = cart.price
                priceBeforeTax = priceBeforeTax.plus(cart.price)
                orderDetailsList.push(orderDetail)
            })

            order.orderDetails = orderDetailsList
            order.beforeTaxPrice = priceBeforeTax.toString()
            order.taxPrice = priceBeforeTax.multipliedBy('0.13').toString()
            order.totalPrice = priceBeforeTax.plus(order.taxPrice.toString()).toString()
            order.paid = false
            order.status = OrderStatus.pending

            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo.save(order)

            orderDetailsList.forEach( async (orderDetail) => {
                orderDetail.order = result.id
                await orderDetailRepo.save(orderDetail)
            })

            callback(null, result)
        }catch(error){
            console.log(error)
            callback(error)
        }
    }

    public findOrderById = async (
        orderId: any,
        callback: (err?: any, order?: Orders | null) => void
    ) =>  {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo?.findOne({
                where: {
                    id: Equal(orderId)
                },
                relations: ['user', 'orderDetails', 'orderDetails.menu']
            })
            callback(null, result)
        }catch(error){
            console.log(error)
            callback(error)
        }
    }

    
    public getCartItems = async (
        userId: number,
    ) : Promise<Cart[]> => {

        try{
            let rallyDataSource = await getDataSource()
            let cartRepo = rallyDataSource.getRepository(Cart)
            const result = await cartRepo.find({
                where: {
                    user: Equal(userId)
                },
                relations: {
                    menu: true,
                }
            })
            if(result == undefined){
                return Array<Cart>()
            }
            return result

        }catch(error){
            throw error
        }
        
    }

    public getStripeCustomerIdFromUser = async (
        userId: number,
    ): Promise<String | null> => {
        try{
            let rallyDataSource = await getDataSource()
            let userRepo = rallyDataSource.getRepository(User)
            const result = await userRepo.findOne({
                where: {
                    id: Equal(userId)
                },
            })

            if(result == null){
                return null
            }
            return result.stripeCustomerId 

        }catch(error){
            throw error
        }
    }

    public updateStripeCustomerIdForUser = async (
        userId: number,
        stripeCustomerId: String
    ) => {
        try{
            let rallyDataSource = await getDataSource()
            let userRepo = rallyDataSource.getRepository(User)
            const result = await userRepo.update(
                { id: userId}, 
                { stripeCustomerId: stripeCustomerId }
            )
        }catch(error){
            console.log(error)
            throw error
        }
    }

    public updateOrderPaymentIntent = async (
        orderId: number,
        paymentIntent: String
    ) => {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            const result = await orderRepo.update(
                { id: orderId}, 
                { stripePaymentIntent: paymentIntent}
            )
        }catch(error){
            console.log(error)
            throw error
        }
    }

    public updateAddress = async (
        orderId: number,
        addressId: number
    ) => {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            const result = await orderRepo.update(
                { id: orderId}, 
                { address: addressId }
            )
        }catch(error){
            console.log(error)
            throw error
        } 
    }

    public updatePaid = async(
        orderId: number,
        paid: boolean
    ) => {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            const result = await orderRepo.update(
                { id: orderId}, 
                { paid: paid }
            )
        }catch(error){
            console.log(error)
            throw error
        } 
    }
}