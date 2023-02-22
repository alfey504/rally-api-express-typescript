import { MenuServices } from './menu.services'
import { Request, Response } from 'express'
import { Menu } from '../../database/entity/menu'

export class MenuController {
    
    menuServices: MenuServices

    constructor() {
        this.menuServices = new MenuServices()
    }

    public getAllMenuItems = async (req: Request, res: Response) => {
        await this.menuServices.getAllMenu((err: any, result: any) => {
            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to get all the menu items: Database Error',
                    data: [{}]
                }
                res.json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully fetched menu from database',
                data: result
            }
            res.json(response)
            return
        })
    }

    public getMenuByCategory = async (req: Request, res: Response) => {
        if (req.params.categoryId == undefined) {
            let response = {
                success: 0,
                message: 'missing parameter {caterogryId:}',
                data: [{}]
            }
            res.json(response)
            return
        }

        await this.menuServices.getMenuByCategory(
            +req.params.categoryId,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message:
                            'Failed to get all the menu items: Database Error',
                        data: [{}]
                    }
                    res.json(response)
                    return
                }

                let response = {
                    success: 0,
                    message: 'Successfully fetched data from the database',
                    data: result
                }
                res.json(response)
                return
            }
        )
    }

    public addMenuItem = async (req: Request, res: Response) => {
        if (req.body.name == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parametr {name:}',
                data: [{}]
            }
            res.json(response)
            return
        }

        if (req.body.description == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parametr {description:}',
                data: [{}]
            }
            res.json(response)
            return
        }

        if (req.body.price == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parametr {price:}',
                data: [{}]
            }
            res.json(response)
            return
        }

        if (req.body.categoryId == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parametr {categoryId:}',
                data: [{}]
            }
            res.json(response)
            return
        }

        let menuItem = new Menu()
        menuItem.name = req.body.name
        menuItem.description = req.body.description
        menuItem.price = req.body.price
        menuItem.category = req.body.category

        await this.menuServices.addMenu(menuItem, (err: any, result: any) => {
            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to add menu item: Database Error',
                    data: [{}]
                }
                console.log(err)
                res.json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Added menu successfully',
                data: [result]
            }
            res.json(response)
            return
        })
    }

    public removeMenuItem = async (req: Request, res: Response) => {
        if (req.params.id == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parametr {id:}',
                data: [{}]
            }
            res.json(response)
            return
        }

        await this.menuServices.removeMenuItem(
            +req.params.id,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to remove menu item',
                        data: [{}]
                    }
                    res.json(response)
                    return
                }

                let response = {
                    success: 1,
                    message: 'Removed menu successfully',
                    data: [result]
                }

                res.json(response)
                return
            }
        )

        await this.menuServices.removeMenuItem(
            +req.params.id,
            (err: any, result: any) => {
                if (err) {
                    let response = {
                        success: 0,
                        message: 'Failed to remove menu item',
                        data: [{}]
                    }
                    res.json(response)
                    return
                }

                let response = {
                    success: 1,
                    message: 'Removed menu successfully',
                    data: [result]
                }

                res.json(response)
                return
            }
        )
    }
}
