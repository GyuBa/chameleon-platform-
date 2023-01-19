import {findUserByID, readUser} from '../controller/UserController';
import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';
import * as bcrypt from 'bcrypt';

export class PassportManager {
    static init() {
        passport.serializeUser((user: any, done) => {
            return done(null, user.id);
        });

        passport.deserializeUser(async (id: any, done) => {
            try {
                return done(null, await findUserByID(id));
            } catch (e) {
                console.error(e);
                return done(e);
            }
        });

        passport.use(new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (userId, password, done) => {
                try {
                    const user = await readUser(userId);
                    if (!(userId && password)) {
                        return done(null, false, {reason: {msg: 'non_field_errors'}});
                    }
                    if (!user) {
                        return done(null, false, {reason: {msg: 'unable_credential_errors'}});
                    }
                    const result = await bcrypt.compare(password, user.password);
                    if (!result) {
                        return done(null, false, {reason: {msg: 'unable_credential_errors'}}); // 비밀번호 틀렸을 때
                    }
                    return done(null, {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    });
                } catch (e) {
                    console.error(e);
                    return done(e);
                }
            },
        ));
    }
}
