import { error } from 'console'
import { Voucher } from '../../database/entity/voucher'
import { VoucherServices } from './voucher.services'
import { Request, Response } from 'express'

export class VoucherController{
     
    voucherServices: VoucherServices

    constructor() {
        this.voucherServices = new VoucherServices()
    }

    public getUsersVoucher = async (req: Request, res: Response) => {

        if(req.params.userId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {userId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.voucherServices.getUnClaimedVouchers(+req.params.userId, (err: any, result?: Voucher[]) => {
            if (err) {
                console.log(error)
                let response = {
                    success: 0,
                    message: 'Failed to get all voucher: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully fetched vouchers from database',
                data: result
            }
            res.json(response)
            return
        })
    }

    public addNewVoucher = async (req: Request, res: Response) => {

        if(req.body.voucherCode == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {voucherCode:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        if(req.body.offerPercent == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {offerPercent:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        let date: Date
        if(req.body.expirationDate == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {expirationDate:}',
                data: []
            }
            res.status(400).json(response)
            return
        }
        date = new Date(Date.parse(req.body.expirationDate))

        if(isNaN(date.getTime())){
            let response = {
                success: 0,
                message: 'invalid parameter {expirationDate:}',
                data: []
            }
            res.status(400).json(response)
            return
        }
                

        await this.voucherServices.addVoucher(
            +req.body.offerPercent,
            req.body.voucherCode,
            date,
            (err?: any, result?: Voucher) => {

            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to get add voucher: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully added voucher',
                data: [result]
            }
            res.json(response)
            return
        })
    }

    public getVoucherByCode = async (req: Request, res: Response) => {

        if(req.params.voucherCode == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {voucherCode:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.voucherServices.getVoucherByCode(
            req.params.voucherCode, 
            (err: any, result?: Voucher) => {

            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to fetch voucher: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully fetched voucher from database',
                data: [result]
            }
            res.json(response)
            return
        })
    }

    public deleteVoucher = async (req: Request, res: Response) => {

        if(req.params.voucherId == undefined){
            let response = {
                success: 0,
                message: 'missing parameter {voucherId:}',
                data: []
            }
            res.status(400).json(response)
            return
        }

        await this.voucherServices.deleteVoucher(
            +req.params.voucherId, 
            (err: any, result?: any) => {

            if (err) {
                let response = {
                    success: 0,
                    message: 'Failed to delete voucher: Database Error',
                    data: []
                }
                res.status(500).json(response)
                return
            }

            let response = {
                success: 1,
                message: 'Successfully deleted voucher from database',
                data: result
            }
            res.json(response)
            return
        })
    }


}