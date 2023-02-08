import { UserData, Verified } from "user_types";
import { getDataSource } from "../../database/data_source"
import { User } from "../../database/entity/User"
import { Equal, Repository } from "typeorm";

export class UserServices{


    public addUser =  async (user: User, callback: (error?: any, result?: any) => void) => {
        try{
            const rallyDataSource = getDataSource();
            const rallyRepo = (await rallyDataSource).getRepository(User);
            const result = rallyRepo.save(user);
            callback(null, result)
        }catch(error){
            callback(error)
        }
    }

    public getUserByUserName = async (userName: String, callback: (error?: any, result?: any) => void) => {
        try{
            const rallyDataSource = getDataSource();
            const rallyRepo = (await rallyDataSource).getRepository(User);
            console.log(userName)
            const result = await rallyRepo.findOne({
                where: {
                    userName: Equal(userName)
                },
            })
            callback(null, result)
        }catch(error){
            callback(error)
        }
    }

    public verifyUser = ((user: UserData): Verified => {
        if(user.fullName == undefined){
            return {
                verified: false,
                message: "parameter {fullName:} is not given"
            }
        }

        if(user.userName == undefined){
            return {
                verified: false,
                message: "parameter {userName:} is not given"
            }
        }

        if(user.password == undefined){
            return {
                verified: false,
                message: "parameter {password:} is not given"
            }
        }

        if(user.email == undefined){
            return {
                verified: false,
                message: "parameter {email:} is not given"
            }
        }

        return {
            verified: true,
            message: ""
        }
    })
}