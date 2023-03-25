import { Request, Response } from 'express'
import Stripe from 'stripe'
import { Orders } from '../../database/entity/order'
import { OrderServices, OrderStatus } from './order.service'
import * as dotenv from 'dotenv'
import * as path  from 'path'
import BigNumber from 'bignumber.js'
import { OrderSockets } from './order.socket'

dotenv.config({ path: path.resolve(__dirname, '../../.env')})

const stripe = new Stripe(process.env.STRIPE_API_KEY! , {
    apiVersion: '2022-11-15'
})



export class  OrderController{

    orderServices: OrderServices
    orderSocket: OrderSockets

    constructor(){
        this.orderServices = new OrderServices()
        this.orderSocket = new OrderSockets()
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
                data: [order]
            }
            res.json(response)
            return
        })        
    }

    public getOrderById = async (req : Request, res: Response) => {
        
        if(req.params.orderId  == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {orderId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        this.orderServices.findOrderById(+req.params.orderId, (err?: any, order?: Orders | null) =>  {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to fetch order',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            if(order == null){
                let response = {
                    success: 0,
                    message: 'no order in database with the id',
                    data: []
                }
                res.status(404).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully fetched order',
                data: [order]
            }
            res.json(response)
            return
        })        
    }

    public getOrderByUser = async (req: Request, res: Response) => {

        if(req.params.userId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {userId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        this.orderServices.findUsersOrders(
            +req.params.userId, 
            (err?: any, orders?: Orders[]) => 
        {
            if(err){
                let response = {
                    success: 0,
                    message: 'failed to fetch orders: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully fetched order',
                data: orders
            }
            res.json(response)
            return
        })
    }

    public getOrderByStatus = async (req: Request, res: Response) => {

        if(req.params.status == undefined || !(req.params.status in OrderStatus)){
            let response = {
                success: 0,
                message: 'invalid parameter {status:} options {pending, rejected, preparing, waiting_for_pickup, on_the_way, completed}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        this.orderServices.findOrderByStatus(
            req.params.status as OrderStatus, 
            (err?: any, orders?: Orders[]) => 
        {
            if(err){
                let response = {
                    success: 0,
                    message: 'failed to fetch orders: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully fetched order',
                data: orders
            }
            res.json(response)
            return
        })
    }

    public makePaymentIntent = async (req: Request, res: Response) => {
        if(req.body.orderId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {orderId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if(req.body.addressId  == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {addressId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        this.orderServices.findOrderById(+req.body.orderId, async (err?: any, order?: Orders | null) =>  {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to fetch order',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            if(order == null){
                let response = {
                    success: 0,
                    message: 'There was no order with given order id',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            
            let stripeCustomerId = await this.orderServices.getStripeCustomerIdFromUser(order.user.id!)
            if(stripeCustomerId == null){ 
                try{
                    let stripeCustomer = await stripe.customers.create()
                    stripeCustomerId = stripeCustomer.id
                    this.orderServices.updateStripeCustomerIdForUser(order.user.id!, stripeCustomerId)
                }catch(error){
                    console.log(error)
                } 
            }
            
            try{
                const ephemeralKey = await stripe.ephemeralKeys.create(
                    {customer: stripeCustomerId?.toString()},
                    {apiVersion: '2022-11-15'}
                  )
    
                let amount = BigNumber(order.totalPrice.toString()).times(100).toFixed(0)
                let amountFloat = parseInt(amount)
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amountFloat,
                    currency: 'cad',
                    customer: stripeCustomerId?.toString(),
                    automatic_payment_methods: {
                        enabled: true
                    },
                })

                this.orderServices.updateOrderPaymentIntent(order.id!, paymentIntent.id)
                this.orderServices.updateAddress(order.id!, +req.body.addressId)

                let response = {
                    success: 1,
                    message: 'successfully made payment intent',
                    data: [{
                        orderId: order.id,
                        paymentIntent: paymentIntent.client_secret,
                        ephemeralKey: ephemeralKey.secret,
                        customer: stripeCustomerId?.toString(),
                        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
                    }]
                }
                res.json(response)  
            }catch(error){
                console.log(error)
                let response = {
                    success: 0,
                    message: 'failed to make payment intent',
                    data: []
                }
                res.status(500).json(response)
            }
        })       
    }

    public placeOrder = async (req: Request, res: Response) => {
        if(req.body.orderId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {orderId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        try{
            await this.orderServices.updatePaid(+req.body.orderId, true)
            await this.orderServices.deleteOrderAssociatedCarts(+req.body.orderId)
            
            let response = {
                success: 1,
                message: 'successfully updated order',
                data: []
            }
            res.json(response)  
        }catch(error){
            console.log(error)
            let response = {
                success: 0,
                message: 'failed to updated order: Database Error',
                data: []
            }
            res.status(500).json(response)
            return
        }
    }


    public updateOrderStatus = async (req: Request, res: Response) => {
        if(req.body.orderId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {orderId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if(req.body.status == undefined || !(req.body.status in OrderStatus)){
            let response = {
                success: 0,
                message: 'invalid parameter {status:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        try{
            await this.orderServices.updateStatus(+req.body.orderId, req.body.status)
            let response = {
                success: 1,
                message: 'successfully updated order',
                data: []
            }
            res.json(response)
            this.orderSocket.notifyStatusChange(+req.body.orderId)

        }catch(error){
            console.log(error)
            let response = {
                success: 0,
                message: 'failed to updated order: Database Error',
                data: []
            }
            res.status(500).json(response)
            return
        }
    }

    public deleteOrderById = async (req: Request, res: Response) => {
        if(req.params.orderId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {orderId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        try{
            await this.orderServices.deleteOrder(+req.params.orderId)
            let response = {
                success: 1,
                message: 'successfully deleted order',
                data: []
            }
            res.json(response)

        }catch(error){
            console.log(error)
            let response = {
                success: 0,
                message: 'failed to delete order: Database Error',
                data: []
            }
            res.status(500).json(response)
            return
        }
    }




}