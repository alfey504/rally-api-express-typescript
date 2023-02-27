import { getDataSource } from '../../database/data_source'
import { Menu } from '../../database/entity/menu'
import { Equal } from 'typeorm'

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

    public getMenuByCategory = async (
        categoryId: number,
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
}
