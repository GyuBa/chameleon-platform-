import * as express from "express"
import {Request, Response} from "express"
import {userInfo, userSignIn, userSignUp} from "../service/LoginService";
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
LoginRouter.post('/passport', (req:any, res, next) => {
    // POST /api/user/login
    passport.authenticate('local', (err, user, info) => {
        // (err, user, info) 는 passport의 done(err, data, logicErr) 세 가지 인자
        if (err) {
            // 서버에 에러가 있는 경우
            console.error(err);
            next(err);
        }
        if (info) {
            // 로직 상 에러가 있는 경우
            return res.status(401).send(info.reason);
        }
        return req.login(user, loginErr => { // req.login() 요청으로 passport.serializeUser() 실행
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).send(user)
        });
    })(req, res, next);
    // 미들웨어(router) 내의 미들웨어(passport)에는 (req, res, next)를 붙입니다.
});