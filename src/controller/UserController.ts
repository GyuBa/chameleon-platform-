import {User} from '../entities/User';
import {source} from '../DataSource';


/**
 * Create user data on user table
 * @param {User} userInput - user information to be added
 */
export async function createUser(user: User) {
    const userRepository = source.getRepository('User');
    try {
        await userRepository.save(user);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Search User data on user table
 * @param {string} userEmail - user Email to be searched
 */
export async function findUserByEmail(email: string) {
    const userRepository = source.getRepository('User');
    try {
        return await userRepository
            .createQueryBuilder('user')
            .where('user.email=:email', {email})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}

export async function findUserById(id: number) {
    const userRepository = source.getRepository('User');
    try {
        return await userRepository
            .createQueryBuilder('user')
            .where('user.id=:id', {id})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}

/**
 * Modify user data on user table
 * @param {User} user
 */
export async function updateUser(user: User) {
    const userRepository = source.getRepository('User');
    try {
        await userRepository
            .createQueryBuilder('user')
            .update(user)
            .set(user);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Dekete user data on user table
 * @param user
 */
export async function deleteUser(user: User) {
    const userRepository = source.getRepository('User');
    try {
        userRepository
            .createQueryBuilder('user')
            .delete()
            .from(User)
            .where('user.id=:id', user);
    } catch (e) {
        console.error(e);
    }
}