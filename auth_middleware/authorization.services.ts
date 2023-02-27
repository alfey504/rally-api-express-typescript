import { Equal } from 'typeorm'
import { getDataSource } from '../database/data_source'
import { Token } from '../database/entity/tokens'


export class AuthorizationServices{


    public static doesTokenBelongToUser = async (
        token: String,
        userId: number,
        callback: (error?: any, result?: any) => void
    ) => {

        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Token)
            const result = await rallyRepo.findOne({
                where: {
                    token: Equal(token)
                }
            })

            if(result!!.user.id == userId){
                callback(null, true)
            }else{
                callback(null, false)
            }
        } catch (error) {
            callback(error)
        }
    }

    public static isTokenBlacklisted = async (
        token: string
    ): Promise<Boolean> => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Token)
            const result = await rallyRepo.findOne({
                where: {
                    token: Equal(token)
                }
            })
            return !result?.blackListed!
        } catch (error) {
            return false
        }
    }
}