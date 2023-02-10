import * as express from 'express';
import {Request, Response} from 'express';
import {passportSignIn, passwordModify, userInfo, userSignIn, userSignUp} from '../service/LoginService';

const LoginRouter = express.Router();

export default LoginRouter;

LoginRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

LoginRouter.post('/sign-in', passportSignIn);
LoginRouter.post('/sign-up', userSignUp);
LoginRouter.get('/info', userInfo);
LoginRouter.post('/modify-password', passwordModify);
// TODO: 바꿀 것
LoginRouter.post('/sign-in-legacy', userSignIn);