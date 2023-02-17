import { Request, Response } from 'express'
import { CartServices } from './cart.services'
import BigNumber from 'bignumber.js'
import { Cart } from '../../database/entity/carts'


export class CartController{

    cartServices: CartServices

    constructor() {
        this.cartServices = new CartServices()
    }

    public addItemToCart = async(req: Request, res: Response) => {

        let quantity: number = 1

        if(req.body.userId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {userId:} in request',
                data: [{}]
            }
            res.json(response)
            return
        }

        if(req.body.menuId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {menuId:} in request',
                data: [{}]
            }
            res.json(response)
            return
        }

        if(req.body.quatntiy != undefined){
            quantity = +req.body.quantity
        }

        await this.cartServices.getMenuItem(+req.body.menuId, async (err: any, menuItem: any) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to add Cart Item: Database Error',
                    data: [{}]
                }
                res.json(response)
                return
            }

            let itemPrice = new BigNumber(menuItem.price)
            let quantity = new BigNumber(req.body.quantity)
            
            let price = itemPrice.multipliedBy(quantity)

            let cart = new Cart()
            cart.menu = menuItem.id
            cart.user = req.body.userId
            cart.quantity = req.body.quantity
            cart.price = price.toString()

            await this.cartServices.addToCart(cart, (err: any, result: any) => {
                if(err){
                    let response = {
                        success: 0,
                        message: 'Failed to add Cart Item: Database Error',
                        data: [{}]
                    }
                    res.json(response)
                    return
                }

                let response = {
                    success: 1,
                    message: 'Added cart to Database successfully',
                    data: [result]
                }
                res.json(response)
                return
            })
        })

    }

    public getUsersItems = async (req: Request, res: Response) => {

        if(req.params.userId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userId:} in request',
                data: [{}]
            }
            res.json(response)
            return
        }

        this.cartServices.getUsersCart(+req.params.userId, (err: any, result: any) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to fetch data from cart: Database Error',
                    data: [{}]
                }
                res.json(response)
                return 
            }

            let response = {
                success: 1,
                message: 'Successfully fetched data from database',
                data: [result]
            }
            res.json(response)
            return
        })
    }

    public getCartItem = async (req: Request, res: Response) => {

        if(req.params.cartId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userId:} in request',
                data: [{}]
            }
            res.json(response)
            return
        }

        this.cartServices.getCartItem(+req.params.cartId, (err: any, result: any) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to fetch data from cart: Database Error',
                    data: [{}]
                }
                res.json(response)
                return 
            }

            let response = {
                success: 1,
                message: 'Successfully fetched data from database',
                data: [result]
            }
            res.json(response)
            return
        })
    }

    public removeCartItem = async (req: Request, res: Response) => {

        if(req.params.cartId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {userId:} in request',
                data: [{}]
            }
            res.json(response)
            return
        }

        this.cartServices.deleteFromCart(+req.params.cartId, (err: any, result: any) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to delete data from cart: Database Error',
                    data: [{}]
                }
                res.json(response)
                return 
            }

            let response = {
                success: 1,
                message: 'Successfully deleted data from database',
                data: [result]
            }
            res.json(response)
            return
        })
    }
}