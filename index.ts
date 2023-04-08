import express, { Express, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { usersRoute, logUserEndPoints } from './api/users/users.router'
import 'reflect-metadata'
import { categoryRouter } from './api/category/category.routes'
import { menuRouter } from './api/menu/menu.routes'
import { cartRouter } from './api/cart/cart.routes'
import  http  from 'http'
import { Server as SocketServer } from 'socket.io'
import { addressRouter } from './api/address/address.routes'
import { orderRouter } from './api/order/order.routes'
import { adminRouter } from './api/admin/admin.routes'
import { voucherRouter } from './api/voucher/voucher.routes'

dotenv.config()

const app = express()
app.use(express.json())


type DevEnvs = 'DEV' | 'PROD'

export let env_type: DevEnvs = 'PROD'

console.log(env_type)
const port = process.env.PORT || '8000'

const server = http.createServer(app)
export const io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
})

app.use('/api/users', usersRoute)
app.use('/api/category', categoryRouter) 
app.use('/api/menu', menuRouter) 
app.use('/api/cart', cartRouter) 
app.use('/api/address', addressRouter)
app.use('/api/orders', orderRouter)
app.use('/api/admin', adminRouter)
app.use('/api/voucher', voucherRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Home')
})

export let socketIds: Map<String, Array<String>> = new Map()


io.on('connection', (socket) => {
    if(socket.handshake.query.userId){
        console.log('yeahh boii')
        let userId = socket.handshake.query.userId.toString()
        if(!socketIds.has(userId)){
            socketIds.set(userId, [socket.id])
        }else{
            socketIds.get(userId)?.push(socket.id)
        }
    }

    io.on('set_user', (data) => {
        console.log('user set call : ', + data)
    })

    io.on('disconnect', (socket) => {
        if(socket.handshake.query.userId){
            const userId = socket.handshake.query.userId.toString()
            const index = socketIds.get(userId)?.indexOf(socket.id)
            if ( index != undefined &&  index > -1) { 
                socketIds.get(userId)?.splice(index, 1) 
            }
        }
    })
})


server.listen(port, () => {
    console.log('[server]: is listening at port http://localhost:' + port)
    console.log(
        '---------------------------------------------------------------------------------------------'
    )
    console.log('User endpoints -->')
    logUserEndPoints()
})
