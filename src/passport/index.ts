import {findUserByID} from "../controller/UserController";
import {local} from "./Local";
import * as passport from 'passport'
export function passportConfig(){
    passport.serializeUser((user:any, done) => {
        console.log('serial')
        return done(null, user.id);
    });

    passport.deserializeUser(async (id:any, done) => {
        console.log('deserial')
        try {
            const user = findUserByID(id)
            return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });
    local();
}