import { UserServices } from './users.services'

export class Verify {

    public static USER_USER_ADDED_SUCCESSFULLY: number = 100
    public static USER_USERNAME_ALREADY_EXISTS: number = 101
    public static USER_EMAIL_ALREADY_EXISTS: number = 102
    
    public static USER_USERNAME_DOES_NOT_EXIST: number = 201
    public static USER_INCORRECT_PASSWORD: number = 202
    public static USER_ID_DOES_NOT_EXIST: number = 200

    private userServices: UserServices

    constructor() {
        this.userServices = new UserServices()
    }

    // check if email already exist in the database
    public doesEmailExist = async (email: String): Promise<Boolean> => {
        let exist: boolean = true
        let callback = (error: any, result: any) => {
            console.log(error)
            console.log(result)
            if (!error) {
                if (result == null) {
                    exist = false
                } else {
                    exist = true
                }
            } else {
                exist = true
            }
        }

        await this.userServices.getUserByEmail(email, callback)
        return exist!
    }

    // check if a username already exist in the database
    public doesUserNameExist = async (userName: String): Promise<Boolean> => {
        let exist: boolean = true

        let callback = (error: any, result: any) => {
            if (!error) {
                if (result == null) {
                    exist = false
                } else {
                    exist = true
                }
            } else {
                exist = true
            }
        }
        await this.userServices.getUserByUserName(userName, callback)
        return exist!
    }

    public isStringEmpty = (string: String): Boolean => {
        const hasOnlyWhitespace = string.trim().length === 0
        return hasOnlyWhitespace
    }
}
