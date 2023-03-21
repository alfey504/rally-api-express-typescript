import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    fullName!: String

    @Column({ unique: true })
    userName!: String

    @Column()
    password!: String

    @Column({ unique: true })
    email!: String

    @Column()
    verified!: boolean

    @Column()
    admin!: boolean

    @Column({nullable: true})
    stripeCustomerId!: String
}
