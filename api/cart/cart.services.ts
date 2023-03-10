import { Equal } from 'typeorm'
import { getDataSource } from '../../database/data_source'
import { Cart } from '../../database/entity/carts'
import { Menu } from '../../database/entity/menu'


export class CartServices{

    public getUsersCart =async (
        userId: number, 
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Cart)
            const result = await rallyRepo.find({
                relations: ['user', 'menu', 'menu.category'],
                where: {
                    user: Equal(userId)
                }
            })
            callback(null, result)
        } catch (error) {
            
            callback(error)
        }  
    }

    public getCartItem =async (
        cartId: number, 
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Cart)
            const result = await rallyRepo.findOne({
                relations: ['user', 'menu', 'menu.category'],
                where: {
                    id: Equal(cartId)
                }
            })
            callback(null, result)
        } catch (error) {
            
            callback(error)
        }  
    }
    
    public addToCart =async (
        cart: Cart, 
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Cart)
            const result = await rallyRepo.save(cart)
            callback(null, result)
        } catch (error) {
            callback(error)
        }  
    }

    public deleteFromCart =async (
        cartId: number, 
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Cart)
            const result = await rallyRepo.delete({
                id: cartId
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }  
    }

    public getMenuItem =async (
        menuId: number, 
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.findOne({
                where: {
                    id: menuId
                }
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }  
    }
}