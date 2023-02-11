import {Request, Response} from 'express';
import {createUser, findUserByEmail, updateUser} from '../controller/UserController';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import {User} from '../entities/User';
import {createWallet} from "../controller/WalletController";

/**
 * provides user sign-in
 * req.body must include { password, email}
 * msg : {
 *     401 - non_field_errors
 *     401 - unable_credential_errors
 *     200 - OK
 * }
 * @param {Request} req - eExpress Request
 * @param {Response} res - Express Response
 * @param {Function} next - Callback Function
 */
export async function userSignIn(req: Request, res: Response, next: () => void) {
    const {email, password} = req.body;
    if (!(email && password)) {
        res.status(401).send({
            'msg': 'non_field_errors'
        });
        return;
    }
    const user = await findUserByEmail(email);
    const result = await bcrypt.compare(password, user.password);
    if (result) {
        res.status(200).send({
            'id': user.id,
            'email': user.email,
            'name': user.name
        });
    } else {
        res.status(401).send({
            'msg': 'unable_credential_errors'
        });
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
export async function userSignUp(req: Request, res: Response, next: () => void) {
    if (!(req.body.name && req.body.password && req.body.email)) {
        res.status(401).send({
            'msg': 'non_field_errors'
        });
        return;
    }

    if (await findUserByEmail(req.body.email)) {
        res.status(401).send({
            'msg': 'duplicated_email_error'
        });
        return;
    }
    const {email, name} = req.body;
    const password = await bcrypt.hashSync(req.body.password, await bcrypt.genSaltSync());
    const user: User = new User();
    user.email = email;
    user.name = name;
    user.password = password;
    await createUser(user);
    res.status(200).send({'msg': 'OK'});
}

export async function userInfo(req, res: Response, next: () => void) {
    if (req.isAuthenticated()) {
        res.status(200).send(await req.user);
    } else {
        res.status(401).send({'msg': 'not_authenticated_error'});
    }
}

export async function passportSignIn(req, res, next) {
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


export async function passwordModify(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({'msg': 'not_authenticated_error'});
    }
    if (!(req.body.password)){
        return res.status(401).send({'msg': 'non_field_error'});
    }
    const password = await bcrypt.hashSync(req.body.password, await bcrypt.genSaltSync());
    console.log(req.user);
    try {
        await updateUser({id: req.user.id, email: req.user.email, name: req.user.name, password: password} as User);
        return res.status(200).send({'msg': 'OK'});
    }
    catch (e) {
        console.log(e);
        return res.status(501).send({'msg': 'server_error'});
    }
}