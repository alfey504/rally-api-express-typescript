import BigNumber from 'bignumber.js'
import { DataSource, Equal } from 'typeorm'
import { getDataSource } from '../../database/data_source'
import { Cart } from '../../database/entity/carts'
import { Orders } from '../../database/entity/order'
import { OrderDetails } from '../../database/entity/order_details'

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

            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo.save(order)
            callback(null, result)
        }catch(error){
            console.log(error)
            callback(error)
        }
    }

    public findOrderById = async (
        orderId: any,
        callback: (err?: any, order?: Orders[]) => void
    ) =>  {
        try{
            let rallyDataSource = await getDataSource()
            let orderRepo = rallyDataSource.getRepository(Orders)
            let result = await orderRepo?.find({
                where: {
                    id: Equal(orderId)
                },
                relations: {
                    user: true,
                    orderDetails: true,
                }
            })
            callback(null, result)
        }catch(error){
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

}