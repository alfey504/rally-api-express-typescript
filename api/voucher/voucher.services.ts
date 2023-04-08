import { ArrayContains, Equal, In, LessThan, LessThanOrEqual, Not } from 'typeorm'
import { getDataSource } from '../../database/data_source'
import { Voucher } from '../../database/entity/voucher'
import { User } from '../../database/entity/users'

export class VoucherServices{
    
    public getUnClaimedVouchers = async (
        userId: number,
        callback: (err?: any, result?: Voucher[]) => void
    ) => {
        try {
            const rallyDataSource = await getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Voucher)
            const result = await rallyRepo.find({
                relations: {
                    claimedUsers: true
                }
            })
            let filteredResult: Voucher[] = [] 
            result.forEach((voucher, i)=>{
                let flag: Boolean = false
                voucher.claimedUsers?.forEach((user)=>{
                    let id: number
                    if(user instanceof User){
                        let userClass = user as User
                        id = user.id!
                    }else{
                        id = user
                    }

                    if(id == userId){
                        flag = true
                        stop
                    }
                })
                if(!flag){
                    filteredResult.push(voucher)
                }
            })
            callback(null, filteredResult)
        } catch (error) {
            console.log(error)
            callback(error)
        }
    }

    public addVoucher = async (
        offerPercent: number,
        voucherCode: string,
        voucherDate: Date | undefined,
        callback: (err?: any, result?: Voucher) => void
    ) => {
        try {
            let voucher = new Voucher()
            voucher.code = voucherCode
            voucher.claimedUsers= []
            voucher.expiration = voucherDate
            voucher.offerPercent = offerPercent
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Voucher)
            const result = await rallyRepo.save(voucher)
            callback(null, result)
        } catch (error) {
            callback(error)
            console.log(error)
        }
    }

    public deleteVoucher = async (
        voucherId: number,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Voucher)
            const result = await rallyRepo.delete({id: Equal(voucherId)})
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public getVoucherByCode = async (
        voucherCode: String,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Voucher)
            const result = await rallyRepo.find({
                where: {
                    code: Equal(voucherCode)
                }
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public getVoucherById = async (
        voucherId: number,
    ): Promise<Voucher | null> => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Voucher)
            const result = await rallyRepo.findOne({where: {id: Equal(voucherId)}})
            return result
        } catch (error) {
            throw error
        }
    }
} 