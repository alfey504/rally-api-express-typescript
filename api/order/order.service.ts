import BigNumber from 'bignumber.js'
import { DataSource, Equal } from 'typeorm'
import { getDataSource } from '../../database/data_source'
import { Cart } from '../../database/entity/carts'
import { Orders } from '../../database/entity/order'
import { OrderCart } from '../../database/entity/order_cart'
import { OrderDetails } from '../../database/entity/order_details'
import { User } from '../../database/entity/users'
import { CartServices } from '../cart/cart.services'
import { VoucherServices } from '../voucher/voucher.services'
import { Voucher } from '../../database/entity/voucher'

export enum OrderStatus{
    pending = 'pending',
    rejected = 'rejected',
    preparing = 'preparing',
    waiting_for_pickup = 'waiting_for_pickup',
    on_the_way = 'on_the_way',
    completed = 'completed'
}

export class OrderServices{

    public makeOrderFromCart = async (
        userId: any,
        voucherId: number | undefined,
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

            
            if(voucherId != undefined){
                let voucherServices = new VoucherServices()
                let voucher = await voucherServices.getVoucherById(voucherId!!)
                if(voucher == null){
                    throw new Error('unable to find voucher')
                }
                let afterOfferPrice = priceBeforeTax.multipliedBy(BigNumber(voucher.offerPercent).dividedBy(100)).dp(2)
                order.voucher = voucher
                order.orderDetails = orderDetailsList
                order.afterOfferPrice = afterOfferPrice.toString()
                order.beforeTaxPrice = priceBeforeTax.toString()
                order.taxPrice = afterOfferPrice.multipliedBy('0.13').dp(2).toString()
                order.totalPrice = afterOfferPrice.plus(order.taxPrice.toString()).toString()
                order.paid = false
                order.status = OrderStatus.pending
            }else{
                order.orderDetails = orderDetailsList
                order.beforeTaxPrice = priceBeforeTax.toString()
                order.taxPrice = priceBeforeTax.multipliedBy('0.13').dp(2).toString()
                order.totalPrice = priceBeforeTax.plus(order.taxPrice.toString()).toString()
                order.paid = false
                order.status = OrderStatus.pending
            }

            
            
            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo.save(order)

            orderDetailsList.forEach( async (orderDetail) => {
                orderDetail.order = result.id
                await orderDetailRepo.save(orderDetail)
            })

            await this.addToOrderCartAssociation(result.id!, carts)

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
                relations: ['user', 'orderDetails', 'orderDetails.menu', 'voucher']
            })
            callback(null, result)
        }catch(error){
            console.log(error)
            callback(error)
        }
    }

    public findOrderByStatus = async (
        status: OrderStatus,
        callback: (err?: any, order?: Orders[]) => void
    ) =>  {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo.find({
                where: {
                    status: Equal(status.toString())
                },
                relations: ['user', 'orderDetails', 'orderDetails.menu','address']
            })
            callback(null, result)
        }catch(error){
            console.log(error)
            callback(error)
        }
    }

    public findUsersOrders = async (
        userId: number,
        callback: (err?: any, orders?: Orders[]) => void
    ) => {
            
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo.find({
                where: {
                    user: Equal(userId),
                    paid: Equal(true)
                },
                relations: ['user', 'orderDetails', 'orderDetails.menu','address']
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

    public updateDate = async(
        orderId: number,
        date: Date
    ) => {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            const result = await orderRepo.update(
                { id: orderId}, 
                { orderPlacedDate: date}
            )
        }catch(error){
            console.log(error)
            throw error
        } 
    }


    public updateStatus = async (
        orderId: number,
        status: OrderStatus,
    ) => {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            const result = await orderRepo.update(
                { id: orderId }, 
                { status: status }
            )
        }catch(error){
            console.log(error)
            throw error
        } 
    }

    public deleteOrder = async (
        orderId: number,
    ) => {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            const result = await orderRepo.delete({ id: Equal(orderId) })
        }catch(error){
            console.log(error)
            throw error
        } 
    }

    public addToOrderCartAssociation = async (
        orderId: number,
        carts: Cart[]
    ) => {
        try{
            console.log('Carts -> ' + carts)
            const orderCart = new OrderCart()
            orderCart.associatedOrder = orderId
            orderCart.associatedCarts = carts
            let rallyDataSource = await getDataSource()
            let orderCartRepo = rallyDataSource.getRepository(OrderCart)
            const result = await orderCartRepo.save(orderCart)
        }catch(error){
            console.log(error)
            throw error
        } 
    }

    public findToOrderCartAssociation = async (
        orderId: number,
    ): Promise<Cart[]> => {
        try{
            let rallyDataSource = await getDataSource()
            let orderCartRepo = rallyDataSource.getRepository(OrderCart)
            const result = await orderCartRepo.findOne({
                where: {
                    associatedOrder: Equal(orderId)
                },
                relations: {
                    associatedCarts: true
                }
            })
            if(result == null){
                return []
            }
            return result.associatedCarts!
        }catch(error){
            console.log(error)
            throw error
        } 
    }

    public deleteOrderCart = async (
        orderId: number,
    ) => {
        try{
            console.log(orderId)
            let rallyDataSource = await getDataSource()
            let orderCartRepo = rallyDataSource.getRepository(OrderCart)
            const result = await orderCartRepo.delete({associatedOrder: Equal(orderId)})
        }catch(error){
            console.log(error)
            throw error
        } 
    }

    public deleteOrderAssociatedCarts = async (
        orderId: number,
    ) => {
        try{
            console.log('OrderServices -> deleteOrderAssociatedCarts')
            console.log(orderId)
            const carts = await this.findToOrderCartAssociation(orderId)
            console.log(carts)
            await this.deleteOrderCart(orderId)
            let rallyDataSource = await getDataSource()
            let cartService = new CartServices()
            carts.forEach((cart)=> {
                cartService.deleteFromCart(cart.id!, (err?: any, result?: any)=>{
                    if(err){
                        throw err
                    }
                })
            })
            await this.deleteOrderCart(orderId)
        }catch(error){
            console.log(error)
            throw error
        } 
    }

    public saveOrder = async (
        order: Orders,
        callback: (err?: any, order?: Orders) => void
    ) =>  {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo.save(order)
            callback(null, result)
        }catch(error){
            console.log(error)
            callback(error)
        }
    }

    public saveOrderDetailsList = async (
        orderDetails: Array<OrderDetails>,
        orderId: number,
        callback: (err?: any, orderDetails?: Array<OrderDetails>) => void
    ) =>  {
        try{
            let rallyDataSource = await getDataSource()
            let orderDetailRepo = rallyDataSource.getRepository(OrderDetails)
            
            let savedDetails = Array<OrderDetails>()

            orderDetails.forEach( async (orderDetail) => {
                orderDetail.order = orderId
                let result = await orderDetailRepo.save(orderDetail)
                savedDetails.push(result)
            })

            callback(null, savedDetails)
        }catch(error){
            console.log(error)
            callback(error)
        }
    }

}