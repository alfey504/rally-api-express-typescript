import BigNumber from 'bignumber.js'
import { DataSource, Equal } from 'typeorm'
import { getDataSource } from '../../database/data_source'
import { Cart } from '../../database/entity/carts'
import { Orders } from '../../database/entity/order'
import { OrderDetails } from '../../database/entity/order_details'

export class OrderServices{

    rallyDataSource?: DataSource

    constructor(){
        let dataSource =  getDataSource()
        dataSource.then((dataSource) => {
            this.rallyDataSource = dataSource
        })
    }

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

            carts.forEach(cart => {
                let orderDetail = new OrderDetails()
                orderDetail.order = order
                orderDetail.menu = cart.menu
                orderDetail.quantity = cart.quantity
                orderDetail.price = cart.price
                priceBeforeTax = priceBeforeTax.plus(cart.price)
            })
            order.orderDetails = orderDetailsList
            order.beforeTaxPrice = priceBeforeTax.toString()
            order.taxPrice = priceBeforeTax.multipliedBy('1.13').toString()
            order.totalPrice = priceBeforeTax.plus(order.taxPrice.toString()).toString()
            order.paid = false

            let orderRepo = this.rallyDataSource?.getRepository(Orders)
            let result = await orderRepo?.save(order)
            callback(null, order)
        }catch(error){
            callback(error)
        }
    }

    public findOrderById = async (
        orderId: any,
        callback: (err?: any, order?: Orders[]) => void
    ) =>  {
        try{
            let orderRepo = this.rallyDataSource?.getRepository(Orders)
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
            const rallyRepo = this.rallyDataSource?.getRepository(Cart)
            const result = await rallyRepo?.find({
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