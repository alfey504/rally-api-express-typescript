import { DataSource } from 'typeorm'
import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { User } from './entity/users'
import { Category } from './entity/category'
import { Menu } from './entity/menu'
import { Token } from './entity/tokens'
import path, { dirname } from 'path'
import { Cart } from './entity/carts'

dotenv.config({ path: path.resolve(__dirname, '../../.env')})

const rallyDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Category, Menu, Token, Cart]
})

rallyDataSource
    .initialize()
    .then(async () => {
        console.log(
            'connection is initialized  with rally ' + process.env.DB_NAME
        )
        rallyDataSource.synchronize()
    })
    .catch((error) => {
        console.error(error)
        console.log(rallyDataSource.options)
    })

export const getDataSource = (delay = 3000): Promise<DataSource> => {
    if (rallyDataSource.isInitialized) return Promise.resolve(rallyDataSource)

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (rallyDataSource.isInitialized) resolve(rallyDataSource)
            else
                reject(
                    'Failed to create connection with ' + process.env.DB_NAME
                )
        })
    })
}
