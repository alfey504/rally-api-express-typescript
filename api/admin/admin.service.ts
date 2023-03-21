import { getDataSource } from '../../database/data_source'
import { User } from '../../database/entity/users'


export class AdminServices{
    // add a user to the database
    public addAdmin = async (
        admin: User,
        callback: (error?: any, result?: any) => void
    ) => {
        try {
            admin.admin = true
            const rallyDataSource = getDataSource()
            const rallyRepo = (await rallyDataSource).getRepository(User)
            const result = rallyRepo.save(admin)
            callback(null, result)
        } catch (error) {
            callback(error)
        }
    }
}