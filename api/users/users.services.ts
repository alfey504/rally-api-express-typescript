import { getDataSource } from '../../database/data_source'
import { User } from '../../database/entity/users'
import { Equal, Repository } from 'typeorm'
import { Token } from '../../database/entity/tokens'

export class UserServices {
    // add a user to the database
    public addUser = async (
        user: User,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            user.admin = false
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            const result = rallyRepo.save(user)
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    // find a user by username
    public getUserByUserName = async (
        userName: String,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            console.log(userName)
            const result = await rallyRepo.findOne({
                where: {
                    userName: Equal(userName)
                }
            })
            callback(null, result)
            return result
        } catch (error) {
            callback(error)
            return null
        }
    }

    // find a user by the email
    public getUserByEmail = async (
        email: String,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            console.log(email)
            const result = await rallyRepo.findOne({
                where: {
                    email: Equal(email)
                }
            })
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    // update a users username in the database
    public updateUserName = async (
        userName: String,
        userId: number,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            const result = await rallyRepo.update(
                { id: userId },
                { userName: userName }
            )
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    // updates a users email in the database
    public updateEmail = async (
        email: String,
        userId: number,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            const result = await rallyRepo.update(
                { id: userId },
                { email: email }
            )
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    // updates a users password in the database
    public updatePassword = async (
        password: String,
        userId: number,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            const result = await rallyRepo.update(
                { id: userId },
                { password: password }
            )
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    // add token to the database
    public saveToken = async (
        token: Token,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Token)
            const result = await rallyRepo.save(token)
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    // blacklist a token
    public blackListToken = async (
        token: string,
        callback: (err?: any, result?: any) => void
    ) => {
        try {
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(Token)
            const result = await rallyRepo.update(
                { token: Equal(token) },
                { blackListed: true }
            )
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }

    // update entire user

    public updateUser = async (
        userId: number,
        userName: String,
        fullName: String,
        email: String,
        password: String | undefined,
        callback: (err?: any, result?: any) => void
    ) => {

        let updates: any

        if(password == undefined){
            updates = { 
                userName: userName,
                email: email,
                fullName: fullName,
            }
        }else{
            updates = { 
                userName: userName,
                email: email,
                fullName: fullName,
                password: password
            }
        }

        try{
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            const result = await rallyRepo.update({ id: Equal(userId) }, updates)
            callback(null, result)  
        }catch(err){
            callback(err, null)
            return
        }
    }
}
