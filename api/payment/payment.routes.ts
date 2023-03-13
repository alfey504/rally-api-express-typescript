import { Router, Request, Response } from 'express'
import { AuthorizationController } from '../../auth_middleware/authorization.controller'
import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import * as path  from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env')})

const stripe = new Stripe(process.env.STRIPE_API_KEY! , {
    apiVersion: '2022-11-15'
})

export const paymentRouter = Router()

paymentRouter.post('/connection_token', async (req: Request, res: Response) => {
    const token = await stripe.terminal.connectionTokens.create()
    res.json({secret: token.secret})
})

paymentRouter.post('/create_payment_intent', async (req: Request, res: Response) => {
    if(req.body.price == undefined){
        res.status(401).json() 
        return 
    }
    const intent = await stripe.paymentIntents.create({
        amount: +req.body.price,
        currency: 'cad',
        payment_method_types: ['card_present'],
        capture_method: 'manual',
    })
    res.json({client_secret: intent.client_secret})
})

paymentRouter.post('/capture_payment_intent', async(req: Request, res: Response) => {
    if(req.body.intentId){
        res.status(401).json()
        return 
    }
    const paymentIntent = await stripe.paymentIntents.capture(req.body.intentId)
    res.json()
})

// paymentRouter.get()