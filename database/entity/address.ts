import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    DeleteDateColumn
} from 'typeorm'
import { User } from './users'


@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne((type) => User)
    @JoinColumn()
    user!: User

    @Column({ nullable: false })
    name!: String

    @Column({ nullable: false })
    line1!: String

    @Column({ nullable: true})
    line2?: String

    @Column({ nullable: false})
    city?: String

    @Column( { nullable: false} )
    country!: String

    @Column({ nullable: false })
    province!: String

    @Column({ nullable: false })
    postalCode!: String

    @CreateDateColumn()
    createdDate!: Date

    @DeleteDateColumn()
    deletedDate!: Date

    constructor(
        userId: any, 
        name: String,
        line1: String, 
        line2: String | undefined = undefined, 
        country: String,
        city: String,
        province: String,
        postalCode: String){
            this.user = userId,
            this.name = name,
            this.line1 = line1,
            this.line2 = line2,
            this.city = city
            this.country = country,
            this.province = province,
            this.postalCode = postalCode
    }
}

