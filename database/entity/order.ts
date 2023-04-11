import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm'
import { Address } from './address'

import { OrderDetails } from './order_details'
import { User } from './users'
import { type } from 'os'
import { Voucher } from './voucher'
import { join } from 'path'

@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id?: number

    @ManyToOne((type) => User, {nullable: false})
    @JoinColumn()
    user!: User

    @OneToMany((type) => OrderDetails, (orderDetails) => orderDetails.order)
    orderDetails?: OrderDetails[]

    @ManyToOne((type) => Address)
    @JoinColumn()
    address?: Address | number

    @Column({ nullable: false })
    totalPrice!: String

    @Column({ nullable: false })
    beforeTaxPrice!: String

    @Column({ nullable: false })
    taxPrice!: String

    @Column({ nullable: true })
    stripePaymentIntent?: String

    @Column({ nullable: false })
    paid?: boolean

    @Column( {nullable: false })
    status!: String

    @Column( {nullable: true} )
    orderPlacedDate?: Date

    @ManyToOne((type) => Voucher, {nullable: true})
    @JoinColumn()
    voucher?: Voucher | number

    @Column( {nullable: true})
    afterOfferPrice?: String

    @Column( {default: 'pickup'})
    orderMethod!: String
}
