import {findUserByID} from '../controller/UserController';
import {local} from './Local';
import * as passport from 'passport';
export function passportConfig(){
    passport.serializeUser((user:any, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser(async (id:any, done) => {
        try {
            return done(null, findUserByID(id));
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });
    local();
}