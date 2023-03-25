import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Orders } from './order'
import { Cart } from './carts'


@Entity()
export class OrderCart{
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne((type) => Orders,  { onDelete: 'CASCADE' })
    @JoinColumn()
    associatedOrder!: Orders | number

    @ManyToMany((type) => Cart, { onDelete: 'CASCADE'})
    @JoinTable()
    associatedCarts?: Cart[]
}