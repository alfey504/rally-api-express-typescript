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

dotenv.config()

const app = express()
app.use(express.json())
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

app.get('/', (req: Request, res: Response) => {
    res.send('Home')
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

server.listen(port, () => {
    console.log('[server]: is listening at port http://localhost:' + port)
    console.log(
        '---------------------------------------------------------------------------------------------'
    )
    console.log('User endpoints -->')
    logUserEndPoints()
})
