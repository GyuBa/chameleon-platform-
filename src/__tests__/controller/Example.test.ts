import {source} from "../../DataSource";
import PlatformServer from "../../server/core/PlatformServer";
import axios from "axios";
import {UserController} from "../../controller/UserController";

PlatformServer.loadConfig();
const instance = axios.create({
    baseURL: 'http://localhost:' + PlatformServer.config.httpPort,
    timeout: 1000
});

describe('Group 1', () => {
    test('Test 1', () => {
        console.log('test');
    });
});

const testAccount = {
    'email': 'test@test.com',
    'password': 'test',
    'username': 'test'
};
describe('Login test', () => {
    test('sign-up', async () => {
        await source.initialize();
        const userController = new UserController();

        const testUser = await userController.findUserByEmail(testAccount.email);
        await userController.deleteUser(testUser);
        const result = await instance.post('/auth/sign-up', testAccount).then(r => r.data);
        console.log(result);
    });

    test('sign-in', async () => {
        const result = await instance.post('/auth/sign-in', testAccount).then(r => ({
            data: r.data,
            cookie: r.headers["set-cookie"][0]
        }));
        console.log(result);
    });

    /*
        test('point', async () => {
            const id = await instance.post('/auth/sign-in', testAccount).then(r => r.data.id);
            const result = await instance.get('/point', {params: {id}}).then(r => r.data);
            console.log(result);
        });
    */
});
