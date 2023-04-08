import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './users'

@Entity()
export class Voucher{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({nullable: false, unique: true})
    code!: String

    @ManyToMany((type) => User, { onDelete: 'CASCADE'})
    @JoinTable()
    claimedUsers?: number[] | User[]

    @Column()
    expiration?: Date

    @Column({nullable: false})
    offerPercent!: number
}