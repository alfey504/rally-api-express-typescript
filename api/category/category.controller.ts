import { CategoryServices } from './catergory.services'
import { Request, Response } from 'express'
import { Category } from '../../database/entity/category'
import { AnyMxRecord } from 'dns'

export class CategoryController {
    categoryServices: CategoryServices

    constructor() {
        this.categoryServices = new CategoryServices()
    }

    public getCategories = async (req: Request, res: Response) => {
        await this.categoryServices.getCategories((err: any, result: any) => {
            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to fecth the categories: Database Error',
                    data: [{}]
                }
                res.json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Sucessfully fetched all data',
                data: result
            }
            res.json(response)
        })
    }

    public addCategory = async (req: Request, res: Response) => {
        if (req.body.category == undefined) {
            let response = {
                success: 0,
                message: 'parameter {category:} missing in request body',
                data: [{}]
            }
            res.json(response)
            return
        }

        let category = new Category()
        category.category = req.body.category
        await this.categoryServices.addCategoy(
            category,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to add category: Database Error',
                        data: [{}]
                    }
                    res.json(response)
                    return
                }

                let response = {
                    success: 1,
                    message: 'Category added successfully',
                    data: [result]
                }
                res.json(response)
            }
        )
    }

    public getCategory = async (req: Request, res: Response) => {
        if (req.params.id == undefined) {
            let response = {
                success: 0,
                message: 'Id not given in the request',
                data: [{}]
            }
            res.json(response)
            return
        }

        await this.categoryServices.getCategoryById(
            +req.params.id,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to get category: Database Error',
                        data: [{}]
                    }
                    res.json(response)
                    return
                }

                let response = {
                    success: 1,
                    message: 'Fetched Category successfyully',
                    data: [result]
                }
                res.json(response)
            }
        )
    }

    public removeCategory = async (req: Request, res: Response) => {
        if (req.params.id == undefined) {
            let response = {
                success: 0,
                message: 'Id not given in the request',
                data: [{}]
            }
            res.json(response)
            return
        }

        await this.categoryServices.deleteCategory(
            +req.params.id,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to delete category: Database error',
                        data: [{}]
                    }
                }

                let response = {
                    success: 1,
                    message: 'Deleted Category successfyully',
                    data: [result]
                }
                res.json(response)
            }
        )
    }
}
