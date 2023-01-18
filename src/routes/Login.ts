import * as express from "express"
import {Request, Response} from "express"
import {userInfo, userSignIn, userSignUp, passportLogin} from "../service/LoginService";
import * as passport from "passport"

const LoginRouter = express.Router()

export default LoginRouter

LoginRouter.get('/', (req: Request, res: Response) => {
    res.send("Hello, World!")
})


LoginRouter.post('/signin', userSignIn);
LoginRouter.post('/signup', userSignUp);
LoginRouter.get('/user-info', userInfo);

// TODO: 바꿀 것
LoginRouter.post('/passport', passportLogin);