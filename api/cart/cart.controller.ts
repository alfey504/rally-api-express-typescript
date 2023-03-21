import { Request, Response } from 'express'
import { CartServices } from './cart.services'
import BigNumber from 'bignumber.js'
import { Cart } from '../../database/entity/carts'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'


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
                data: []
            }
            res.status(400).json(response)
            return
        }

        if(req.body.menuId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {menuId:} in request',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if(req.body.quantity != undefined){
            try{

                quantity = +req.body.quantity

            }catch(error){

                let response = {
                    success: 0,
                    message: 'invalid quantity',
                    data: []
                }
                res.status(400).json(response)
                return
            }
           
        }

        let token = req.get('authorization')!!
        token = token.slice(7)

        let doesTokenBelongToUser = await AuthorizationController.tokenBelongsToUser(token, req.body.userId, (error?: any, result?: Boolean) => {
            if(error){
                let response = {
                    success: 0,
                    message: 'Failed to Verify if token belongs to user: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            if(!result){

                let response = {
                    success: 0,
                    message: 'Token does not belong to user',
                    data: []
                }
                res.status(401).json(response)
                return 
            }
        })
        console.log(doesTokenBelongToUser)
        if(doesTokenBelongToUser == undefined || doesTokenBelongToUser == false) return

        await this.cartServices.getMenuItem(+req.body.menuId, async (err: any, menuItem: any) => {
            
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to get Menu Item: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }
            
            let itemPrice = new BigNumber(menuItem.price)
            let bigQuantity = new BigNumber(quantity)
            
            let price = itemPrice.multipliedBy(bigQuantity)

            let cart = new Cart()
            cart.menu = menuItem.id
            cart.user = req.body.userId
            cart.quantity = quantity
            cart.price = price.toString()

            await this.cartServices.addToCart(cart, (err: any, result: any) => {
                if(err){
                    let response = {
                        success: 0,
                        message: 'Failed to add Cart Item: Database Error',
                        data: []
                    }
                    console.log(err)
                    res.status(500).json(response)
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
                data: []
            }
            res.status(400).json(response)
            return
        }

        let token = req.get('authorization')!!
        token = token.slice(7)

        let doesTokenBelongToUser = await AuthorizationController.tokenBelongsToUser(token, +req.params.userId, (error?: any, result?: Boolean) => {
            if(error){
                let response = {
                    success: 0,
                    message: 'Failed to Verify if token belongs to user: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            if(!result){

                let response = {
                    success: 0,
                    message: 'Token does not belong to user',
                    data: []
                }
                res.status(401).json(response)
                return
            }
        })

        if(doesTokenBelongToUser == undefined || doesTokenBelongToUser == false) return

        this.cartServices.getUsersCart(+req.params.userId, (err: any, result: any) => {
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to fetch data from cart: Database Error',
                    data: []
                }
                res.status(400).json(response)
                return 
            }

            let response = {
                success: 1,
                message: 'Successfully fetched data from database',
                data: result
            }
            res.json(response)
            return
        })
    }

    public getCartItem = async (req: Request, res: Response) => {
        if(req.params.cartId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {cartId:} in request',
                data: []
            }
            res.status(400).json(response)
            return
        }
        let token = req.get('authorization')!!
        token = token.slice(7)

        this.cartServices.getCartItem(+req.params.cartId, async (err: any, result: any) => {

            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to fetch data from cart: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return 
            }

            if(result == null){
                let response = {
                    success: 0,
                    message: 'Item does not exist in cart',
                    data: []
                }
                res.status(401).json(response)
                return 
            }

            let doesTokenBelongToUser = await AuthorizationController.tokenBelongsToUser(token, result.user.id, (error?: any, result?: Boolean) => {
                if(error){
                    let response = {
                        success: 0,
                        message: 'Failed to Verify if token belongs to user: Database Error',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                }
    
                if(!result){
    
                    let response = {
                        success: 0,
                        message: 'Token does not belong to user',
                        data: []
                    }
                    res.status(401).json(response)
                    return
                }
            })

            if(doesTokenBelongToUser == undefined || doesTokenBelongToUser == false) return

            let response = {
                success: 1,
                message: 'Successfully fetched data from database',
                data: result
            }
            res.json(response)
            return
        })
    }

    public removeCartItem = async (req: Request, res: Response) => {

        if(req.params.cartId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {cartId:} in request',
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.cartServices.getCartItem(+req.params.cartId, async (err?: any, result?: any)=>{
            if(err){
                let response = {
                    success: 0,
                    message: 'Failed to fetch data from cart: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return 
            }

            let token = req.get('authorization')!!
            token = token.slice(7)
            let doesTokenBelongToUser = await AuthorizationController.tokenBelongsToUser(token, result.user.id, (error?: any, isTokenUsersToken?: Boolean) => {
                if(error){
                    let response = {
                        success: 0,
                        message: 'Failed to Verify if token belongs to user: Database Error',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                }
                if(!isTokenUsersToken){
                    let response = {
                        success: 0,
                        message: 'Token does not belong to user',
                        data: []
                    }
                    res.status(401).json(response)
                    return
                }
            })

            if(doesTokenBelongToUser == undefined || doesTokenBelongToUser == false) return
            
            this.cartServices.deleteFromCart(+req.params.cartId, (err: any, result: any) => {
                if(err){
                    let response = {
                        success: 0,
                        message: 'Failed to delete data from cart: Database Error',
                        data: []
                    }
                    res.status(500).json(response)
                    return 
                }
                let response = {
                    success: 1,
                    message: 'Successfully deleted data from database',
                    data: []
                }
                res.json(response)
                return
            })
        })
    }
}