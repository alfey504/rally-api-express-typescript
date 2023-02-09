import { getDataSource } from '../../database/data_source'
import { User } from '../../database/entity/User'
import { Equal, Repository } from 'typeorm'

export class UserServices {
  public addUser = async (
    user: User,
    callback: (error?: any, result?: any) => void
  ) => {
    try {
      const rallyDataSource = getDataSource()
      const rallyRepo = (await rallyDataSource).getRepository(User)
      const result = rallyRepo.save(user)
      callback(null, result)
    } catch (error) {
      callback(error)
    }
  }

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

  public updateEmail = async (
    email: String,
    userId: number,
    callback: (error?: any, result?: any) => void
  ) => {
    try {
      const rallyDataSource = getDataSource()
      const rallyRepo = (await rallyDataSource).getRepository(User)
      const result = await rallyRepo.update({ id: userId }, { email: email })
      callback(null, result)
    } catch (error) {
      callback(error)
    }
  }

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
}
