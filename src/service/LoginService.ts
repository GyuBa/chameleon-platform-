import {Request, Response} from 'express';
import {createUser, readUser} from '../controller/UserController';
import {UserInterface} from '../interface/UserInterface';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
const saltRounds = 10;


export async function passportSignIn(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.message);
        }

        return req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }

            return res.status(200).send(user);
        });
    });
}

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
    const user = await readUser(email);
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

    if (await readUser(req.body.email)) {
        res.status(401).send({
            'msg': 'duplicated_email_error'
        });
        return;
    }
    const {password} = req.body;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(password, salt);
    const user: UserInterface = {
        id: undefined,
        email: req.body.email,
        password: hash,
        name: req.body.name
    };
    await createUser(user);
    res.status(200).send({'msg': 'OK'});
}

export async function userInfo(req, res:Response, next:() => void){
    if(req.isAuthenticated()){
        res.status(200).send(await req.user);
        return;
    }
    else{
        res.status(401).send({'msg': 'not_authenticated_error'});
        return;
    }
}

export async function passportLogin(req, res, next){
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            next(err);
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).send(user);
        });
    })(req, res, next);
}