import { getDataSource } from '../../database/data_source'
import { Category } from '../../database/entity/category'

export class CategoryServices {
    public getCategories = async (
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Category)
            const result = await rallyRepo.find({})
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public getCategoryById = async (
        id: number,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Category)
            const result = await rallyRepo.findOne({
                where: {
                    id: id
                }
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public addCategoy = async (
        category: Category,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Category)
            const result = await rallyRepo.save(category)
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public deleteCategory = async (
        id: number,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Category)
            const result = await rallyRepo.delete({ id: id })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }
}
