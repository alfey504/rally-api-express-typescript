import { getDataSource } from '../../database/data_source'
import { Menu } from '../../database/entity/menu'
import { Equal, ILike } from 'typeorm'
import { Category } from '../../database/entity/category'

export class MenuServices {
    
    public getAllMenu = async (callback: (err?: any, result?: any) => void) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.find({
                relations: {
                    category: true
                }
            })
            callback(null, result)
        } catch (error) {
            
            callback(error)
        }
    }

    public getMenuById =async ( 
        menuId: number, 
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.findOne({
                where:{
                    id: menuId
                },
                relations: {
                    category: true
                }
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public searchMenu = async (
        search: String, 
        callback: (err?: any, result?: any) => void
    ) => {

        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.find({
                relations: {
                    category: true
                },
                where: {
                    name: ILike('%' + search + '%')
                }
            })
            callback(null, result)
        } catch (error) {
            
            callback(error)
        }
    }
    
    public getMenuByCategory = async (
        categoryId: number,
        callback: (err?: any, result?: Array<Menu>) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.find({
                relations: {
                    category: true
                },
                where: {
                    category: Equal(categoryId)
                }
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public addMenu = async (
        menuItem: Menu,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.save(menuItem)
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public removeMenuItem = async (
        id: number,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.delete({
                id: id
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public updateMenuImage = async (
        menuId: number,
        image: String,
        callback: (err?: any, result?: any) => void
    ) => {
        try{
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Menu)
            const result = await rallyRepo.update(
                {id: menuId},
                {image: image}
            )
            callback(null, result)
        }catch (error) {
            callback(error)
        }
    }
}
