import * as express from "express"
import { Request, Response } from "express"
import {userSignIn, userSignUp} from "../service/loginService";
const LoginRouter = express.Router()


export default LoginRouter

LoginRouter.get('/', (req:Request, res:Response) => {
    res.send("Hello, World!")
})

LoginRouter.post('/signin', userSignIn)
LoginRouter.post('/signup', userSignUp)

