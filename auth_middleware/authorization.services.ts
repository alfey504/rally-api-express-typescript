import { Equal } from 'typeorm'
import { getDataSource } from '../database/data_source'
import { Token } from '../database/entity/tokens'


export class AuthorizationServices{


    public static doesTokenBelongToUser = async (
        token: String,
        userId: number,
        callback: (error?: any, result?: any) => void
    ): Promise<Boolean | undefined> => {

        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Token)
            const result = await rallyRepo.findOne({
                relations: {
                    user: true
                },
                where: {
                    token: Equal(token)
                }
            })
            console.log('Authorization Services -> doesTokenBelongToUser > Result: ' , result)

            if(result!!.user.id == userId){
                callback(null, true)
                return true
            }else{
                callback(null, false)
                return false
            }
            
        } catch (error) {
            callback(error)
            return undefined
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