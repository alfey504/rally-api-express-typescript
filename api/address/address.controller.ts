import { Request, Response } from 'express'
import { Address } from '../../database/entity/address'
import { AddressService } from './address.service'

export class AddressController{

    addressService: AddressService

    constructor() {
        this.addressService = new AddressService()
    }

    public addNewAddress = async (req: Request, res: Response) => {
        
        if (req.body.userId == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parameter {userId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if (req.body.name == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parameter {name:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if (req.body.line1 == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parameter {line1:}',
                data: []
            }
            res.status(400).json(response)
            return
        }


        if (req.body.country == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parameter {country:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if (req.body.province == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parameter {province:}',
                data: []
            }
            res.status(400).json(response)
            return
        } 
        
        if (req.body.postalCode == undefined) {
            let response = {
                success: 0,
                message: 'Request missing parameter {postalCode:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        let address = new Address(
            req.body.userId,
            req.body.name,
            req.body.line1,
            req.body.line2,
            req.body.country,
            req.body.province,
            req.body.postalCode,
        )
    
        await this.addressService.insertAddress(address, (err: any, result: any) => {
            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to add address: Database Error',
                    data: []
                }
                console.log(err)
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Added address successfully',
                data: [result]
            }

            res.json(response)
            return
        })
    }

    public getAddressByUserId = async (req: Request, res: Response) => {
        if(req.params.userId == undefined){
            let response = {
                success: 0,
                message: 'Request missing parameter {userId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.addressService.findAddressByUserId(+req.params.userId, (err: any, result: any) => {
            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to fetch address: Database Error',
                    data: []
                }
                console.log(err)
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'fetched address successfully',
                data: result
            }
            res.json(response)
            return
        })
    }

    public removeAddress = async (req: Request, res: Response) => {
        
        if(req.params.userId){
            let response = {
                success: 0,
                message: 'Request missing parameter {userId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.addressService.deleteAddress(+req.params.addressId, (err: any, result: any) => {
            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to remove address: Database Error',
                    data: []
                }
                console.log(err)
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Deleted address successfully',
                data: []
            }
            res.json(response)
            return
        })
    }
}