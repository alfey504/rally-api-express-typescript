import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { Menu } from './menu'
import { User } from './users'

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id?: number

    @ManyToOne((type) => User)
    @JoinColumn()
    user!: User

    @ManyToOne((type) => Menu)
    @JoinColumn()
    menu!: Menu

    @Column({ nullable: false })
    quantity!: number

    @Column({ nullable: false })
    price!: string
}
