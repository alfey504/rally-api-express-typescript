import { type } from 'os'
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({ nullable: false })
    token!: String

    @ManyToOne((type) => User)
    @JoinColumn()
    user!: User

    @Column({ nullable: false })
    blackListed!: Boolean
}
