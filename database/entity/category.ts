import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({ nullable: false })
    category!: String
}
