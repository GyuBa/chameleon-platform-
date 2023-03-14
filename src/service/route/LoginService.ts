import {Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import {User} from '../../entities/User';
import {RouteService} from '../interfaces/route/RouteService';
import {RESPONSE_MSG} from '../../constant/Constants';

export class LoginService extends RouteService {
    initRouter() {
        this.router.post('/sign-in', this.passportSignIn);
        this.router.post('/sign-up', this.userSignUp);
        this.router.get('/info', this.userInfo);
        this.router.post('/modify-password', this.passwordModify);

        this.router.post('/sign-in-legacy', this.userSignIn);
        // TODO: 삭제 요망
    }

    /**
     * provides user sign-in
     * req.body must include { password, email}
     * msg : {
     *     401 - non_field_errors
     *     401 - unable_credential_errors
     *     200 - OK
     * }
     * @param {Request} req - Express Request
     * @param {Response} res - Express Response
     * @param {Function} next - Callback Function
     */
    async userSignIn(req: Request, res: Response, next: Function) {
        const {email, password} = req.body;
        if (!(email && password)) {
            res.status(401).send(RESPONSE_MSG.NON_FIELD);
            return;
        }
        const user = await this.userController.findUserByEmail(email);
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            res.status(200).send({
                'id': user.id,
                'email': user.email,
                'name': user.name
            });
        } else {
            res.status(401).send(RESPONSE_MSG.UNABLE_CREDENTIAL);
        }
    }

    /**
     * provides user sign-up
     * req.body must include { name, password, email}
     * msg : {
     *     401 - non_field_errors
     *     401 - duplicated_email_error
     *     200 - OK
     * }
     * @param {Request} req - Express Request
     * @param {Response} res - Express Response
     * @param {Function} next - Callback Function
     */
    async userSignUp(req: Request, res: Response, next: Function) {
        if (!(req.body.name && req.body.password && req.body.email)) {
            res.status(401).send(RESPONSE_MSG.NON_FIELD);
            return;
        }

        if (await this.userController.findUserByEmail(req.body.email)) {
            res.status(401).send(RESPONSE_MSG.DUPLICATED_EMAIL);
            return;
        }
        const {email, name} = req.body;
        const password = await bcrypt.hashSync(req.body.password, await bcrypt.genSaltSync());
        const user: User = new User();
        user.email = email;
        user.name = name;
        user.password = password;
        await this.userController.createUser(user);
        res.status(200).send(RESPONSE_MSG.OK);
    }

    async userInfo(req: Request, res: Response, next: Function) {
        if (req.isAuthenticated()) {
            res.status(200).send(await req.user);
        } else {
            res.status(401).send(RESPONSE_MSG.NOT_AUTH);
        }
    }

    async passportSignIn(req: Request, res: Response, next: Function) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (info) {
                return res.status(401).send(info.reason.msg);
            }

            return req.login(user, error => {
                if (error) {
                    return next(error);
                }
                return res.status(200).send(user);
            });
        })(req, res, next);
    }


    async passwordModify(req: Request, res: Response, next: Function) {
        if (!req.isAuthenticated()) {
            return res.status(401).send(RESPONSE_MSG.NOT_AUTH);
        }
        if (!(req.body.password)) {
            return res.status(401).send(RESPONSE_MSG.NON_FIELD);
        }
        const password = await bcrypt.hashSync(req.body.password, await bcrypt.genSaltSync());
        console.log(req.user);
        try {
            const user = new User();
            user.password = password;
            await this.userController.updateUser(user);
            return res.status(200).send(RESPONSE_MSG.OK);
        } catch (e) {
            console.log(e);
            return res.status(501).send(RESPONSE_MSG.SERVER_ERROR);
        }
    }
}