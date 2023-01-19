import {findUserByID} from '../controller/UserController';
import {local} from './Local';
import * as passport from 'passport';
export function passportConfig(){
    passport.serializeUser((user:any, done) => {
        console.log('serial');
        return done(null, user.id);
    });

    passport.deserializeUser(async (id:any, done) => {
        console.log('deserial');
        try {
            return done(null, findUserByID(id));
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });
    local();
}