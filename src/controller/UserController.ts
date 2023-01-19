import {UserInterface} from '../interface/UserInterface';
import {User} from '../entities/User';
import {source} from '../DataSource';


/**
 * Create user data on user table
 * @param {UserInterface} userInput - user information to be added
 */
export async function createUser(userInput: UserInterface) {
    const userRepository = source.getRepository('User');
    try {
        const user = new User();
        user.email = userInput.email;
        user.password = userInput.password;
        user.name = userInput.name;
        await userRepository.save(user);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Search User data on user table
 * @param {string} userEmail - user Email to be searched
 */
export async function readUser(userEmail: string) {
    const userRepository = source.getRepository('User');
    try {
        return await userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.email', 'user.name', 'user.password'])
            .where('user.email="' + userEmail + '"')
            .getOne();
    } catch (e) {
        console.log(e);
    }
}

export async function findUserByID(id: number) {
    const userRepository = source.getRepository('User');
    try {
        return await userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.email', 'user.name', 'user.password'])
            .where('user.id="' + id + '"')
            .getOne();
    } catch (e) {
        console.log(e);
    }
}

/**
 * Modify user data on user table
 * @param {UserInterface} user
 */
export async function updateUser(user: UserInterface) {
    const userRepository = source.getRepository('User');
    try {
        await userRepository
            .createQueryBuilder('user')
            .update(user)
            .set({
                email: user.email,
                password: user.password,
                name: user.name
            });
    } catch (e) {
        console.log(e);
    }
}

/**
 * Dekete user data on user table
 * @param user
 */
export async function deleteUser(user: UserInterface) {
    const userRepository = source.getRepository('User');
    try {
        userRepository
            .createQueryBuilder('user')
            .delete()
            .from(User)
            .where('user.id="' + user.id + '"');
    } catch (e) { /* empty */
    }
}