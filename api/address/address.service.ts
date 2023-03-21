import { Equal } from 'typeorm'
import { getDataSource } from '../../database/data_source'
import { Address } from '../../database/entity/address'

export class AddressService{

    public insertAddress = async (
        address: Address,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Address)
            const result = await rallyRepo.save(address)
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public findAddressByUserId =async (
        userId: number,
        callback: (err?: any, result?: any) => void
    ) => {
        try{
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Address)

            const result = await rallyRepo.find({
                where:{
                    user: Equal(userId)
                },
                relations: {
                    user: true
                }
            })
            callback(null, result)
        }catch(error) {
            callback(error)
        }
    }

    public deleteAddress = async (
        addressId: number,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Address)
            const result = await rallyRepo.delete({
                id: addressId
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    public updateAddress = async (
        address: Address,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Address)
            const result = await rallyRepo.update({
                id: Equal(address.id)
            }, address)
            
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }
    
}