import { CategoryServices } from './category.services'
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
                    message: 'Failed to fetch the categories: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully fetched all data',
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
                data: []
            }
            res.status(400).json(response)
            return
        }

        let category = new Category()
        category.category = req.body.category
        await this.categoryServices.addCategory(
            category,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to add category: Database Error',
                        data: []
                    }
                    res.status(500).json(response)
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
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.categoryServices.getCategoryById(
            +req.params.id,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to get category: Database Error',
                        data: []
                    }
                    res.status(500).json(response)
                    return
                }

                if(result == null){
                    let response = {
                        success: 0,
                        message: 'does not have category with {id: ' + +req.params.id + '}',
                        data: []
                    }
                    res.status(404).json(response)
                    return
                }

                let response = {
                    success: 1,
                    message: 'Fetched Category successfully',
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
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.categoryServices.deleteCategory(
            +req.params.id,
            (err: any, result: any) => {
                
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to delete category: Database error',
                        data: []
                    }
                    res.status(500).json(response)
                }
                
                if(result.affected == 0){
                    let response = {
                        success: 0,
                        message: 'Category with id:' + req.params.id + ' does not exist',
                        data: []
                    }
                    res.status(404).json(response)
                }

                let response = {
                    success: 1,
                    message: 'Deleted Category successfully',
                    data: [result]
                }
                res.json(response)
            }
        )
    }
}
