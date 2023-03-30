import {User} from '../entities/User';
import {BaseController} from './interfaces/BaseController';
import {DataSource} from "typeorm";

export class UserController extends BaseController<User> {
    constructor(source: DataSource) {
        super(source, User);
    }

    /**
     * Create user data on user table
     * @param {User} userInput - user information to be added
     */
    async createUser(user: User) {
        try {
            await this.repository.save(user);
            return user;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Search User data on user table
     * @param {string} userEmail - user Email to be searched
     */
    async findUserByEmail(email: string) {
        try {
            return await this.repository
                .createQueryBuilder()
                .where('user.email=:email', {email})
                .getOne();
        } catch (e) {
            console.error(e);
        }
    }

    async findUserById(id: number) {
        try {
            return await this.repository
                .createQueryBuilder()
                .select()
                .where('user.id=:id', {id})
                .getOne();
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Modify user data on user table
     * @param {UserInterface} userData
     */
    async updateUser(userData: User) {
        try {
            await this.repository
                .createQueryBuilder()
                .update(User)
                .set(userData)
                .where('id=:id', userData)
                .execute();
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Dekete user data on user table
     * @param user
     */
    async deleteUser(user: User) {
        try {
            await this.repository
                .createQueryBuilder()
                .delete()
                .from(User)
                .where('user.id=:id', user)
                .execute();
        } catch (e) {
            console.error(e);
        }
    }


}