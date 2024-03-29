import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm'

import { Menu } from './menu'
import { Orders } from './order'

@Entity()
export class OrderDetails {
    @PrimaryGeneratedColumn()
    id?: number

    @ManyToOne((type) => Orders, (order) => order.orderDetails, { onDelete: 'CASCADE' })
    @JoinColumn()
    order?: Orders | number

    @ManyToOne((type) => Menu)
    @JoinColumn()
    menu!: Menu

    @Column({ nullable: false })
    price!: String

    @Column({ nullable: false })
    quantity!: number
}
