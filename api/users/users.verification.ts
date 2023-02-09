import { UserData } from 'user_types'
import { UserServices } from './users.services'

export class Verify {
  public static USER_USER_ADDED_SUCCESSFULLY: number = 100
  public static USER_USERNAME_ALREADY_EXISTS: number = 101
  public static USER_EMAIL_ALREADY_EXISTS: number = 102

  private userSevices: UserServices

  constructor() {
    this.userSevices = new UserServices()
  }

  public doesEmaiExist = async (email: String): Promise<Boolean> => {
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

    await this.userSevices.getUserByEmail(email, callback)
    return exist!
  }

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
    await this.userSevices.getUserByUserName(userName, callback)
    return exist!
  }

  // public verifyUser = (async (user: UserData): Promise<Verified> => {
  //     if(user.fullName == undefined){
  //         return {
  //             verified: false,
  //             message: "parameter {fullName:} is not given",
  //             code: undefined
  //         }
  //     }

  //     if(user.userName == undefined){
  //         return {
  //             verified: false,
  //             message: "parameter {userName:} is not given",
  //             code: undefined,
  //         }
  //     }

  //     let userNameVerification = await this.verifyUsername(user.userName)
  //     if(!userNameVerification.verified){
  //         return userNameVerification
  //     }

  //     let emailVerification =  await this.doesEmaiExist(user.email)
  //     if(!emailVerification.verified){
  //         return emailVerification
  //     }

  //     return {
  //         verified: true,
  //         message: "",
  //         code: undefined
  //     }
  // })
}
