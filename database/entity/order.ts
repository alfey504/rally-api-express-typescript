import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm'

import { Menu } from './menu'
import { OrderDetails } from './order_details'
import { User } from './users'

@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id?: number

    @ManyToOne((type) => User)
    @JoinColumn()
    user!: User

    @OneToMany((type) => OrderDetails, orderDetails => orderDetails.order)
    orderDetails!: OrderDetails[]

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

}
