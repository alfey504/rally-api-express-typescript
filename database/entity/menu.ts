import { type } from 'os'
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { Category } from './category'

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    name!: String

    @Column({ nullable: true })
    description?: String

    @Column({ nullable: false })
    price!: string

    @ManyToOne((type) => Category)
    @JoinColumn()
    category!: Category
}
